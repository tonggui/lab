import message from '@/store/helper/toast'
import { Message } from '@roo-design/roo-vue'
import { PACKAGE_PRODUCT_OPT_STATUS } from '@/data/enums/product'
import _ from 'lodash'

export default (api) => ({
  async getList ({ state, commit, dispatch }, commonParameter = {}) {
    try {
      commit('setLoading', true)
      commit('setError', false)
      const { pageSize, current } = state.pagination
      const query = _.merge({}, {
        ...commonParameter,
        pageNo: current,
        pageSize,
        firstIn: state.firstIn
      })
      if (current * pageSize > 10000) {
        message.error('您所查看的页面数过大暂无法加载')
        return
      }
      commit('setSearchParamsBefore', commonParameter)
      const result = await api.getList(query)
      if (commonParameter) {
        commit('setSearchParams', commonParameter)
      }
      const { totalCount: total } = result
      const resultPagination = {
        total,
        pageSize: result.pageSize
      }
      /**
       * 商品请求的分页数目 溢出当前商品总数 需要重新获取
       */
      if (current > 1 && pageSize * (current - 1) >= total) {
        const newCurrent = Math.ceil(total / pageSize)
        commit('setPagination', {
          ...resultPagination,
          current: newCurrent
        })
        dispatch('getList', state.searchParams)
        return
      }
      const { resultList } = result
      let list = []
      if (resultList === null) {
        list = []
        commit('setList', list)
        return
      }
      commit('setList', list)
      commit('setPagination', resultPagination)
    } catch (err) {
      console.error(err)
      if (err.code === -1 && err.message) {
        message.error(err.message)
      } else {
        message.error('系统异常~')
      }
      commit('setError', true)
    } finally {
      commit('setLoading', false)
      commit('setFirstIn', 0)
    }
  },
  pagePrev ({ commit, state, dispatch }) {
    const { pagination } = state
    const { current } = pagination
    if (current > 1) {
      commit('setPagination', { ...pagination, current: current - 1 })
      dispatch('getList', state.searchParams)
    } else {
      dispatch('getList', state.searchParams)
    }
  },
  pageChange ({ commit, state, dispatch }, pagination) {
    commit('setPagination', pagination)
    dispatch('getList', state.searchParams)
  },
  statusChange ({ commit, dispatch }, status) {
    dispatch('resetPagination')
  },
  resetPagination ({ commit, dispatch }) {
    commit('resetPagination')
  },
  destroy ({ commit }) {
    commit('destroy')
  },
  async delete ({ state, dispatch }, { product, packageConfirmFlag, callback }) {
    console.log('actions.js =>', 'packageConfirmFlag:', packageConfirmFlag, 'callback:', callback)
    const { wmPoiId, skuId } = product
    console.log('单个商品删除 -> wmPoiId:', wmPoiId, 'skuIds:', skuId + '')
    await api.delete({ wmPoiId, skuIds: skuId + '', packageConfirmFlag }).then(async () => {
      // Message.success(`商品删除成功～`)
      // 删除最后一个商品的时候，分页需要往前推一页
      // if (state.list.length === 1) {
      //   dispatch('pagePrev')
      // } else {
      //   dispatch('getList', state.searchParams)
      // }
      await dispatch('resetPagination')
      dispatch('getList', state.searchParams)
    }).catch((err) => {
      // if (err.message) {
      //   Message.error(err.message)
      // }
      // 单个商品删除涉及组包时code:8302
      if (err.code === PACKAGE_PRODUCT_OPT_STATUS.DELETE_CONFIRM && callback) {
        callback(err)
      } else {
        Message.error(err.message || '商品删除失败～')
      }
    })
  }
})
