import message from '@/store/helper/toast'
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
      const { list = [] } = result
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
  async delete ({ state, dispatch }, { product, callback }) {
    // TODO 清除配置接口
    // await api.delete().then(async () => {
    //   await dispatch('resetPagination')
    //   dispatch('getList', state.searchParams)
    // }).catch((err) => {
    //   message.error(err.message || '清除配置失败～')
    // })
  }
})
