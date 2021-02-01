import message from '@/store/helper/toast'
import {
  MEDICINE_REGISTER_BATCH_OPARATION_ENUM
} from '@/data/enums/register'
import _ from 'lodash'
import { sleep } from '@/common/utils'

export default (api) => ({
  async getList ({ state, commit, dispatch }) {
    try {
      commit('setLoading', true)
      commit('setError', false)
      const { pageSize, current } = state.pagination
      const query = _.merge({}, {
        ...state.searchParams,
        pageNo: current,
        pageSize
      })
      if (current * pageSize > 10000) {
        message.error('您所查看的页面数过大暂无法加载')
        return
      }
      commit('setSearchParamsBefore', state.searchParams)
      const result = await api.getList(query)
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
        dispatch('getList')
        return
      }
      const { ruleList = [] } = result
      commit('setList', ruleList)
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
    }
  },
  async getCityList ({ commit, state, dispatch }) {
    const list = await api.getCityList()
    commit('setCityList', list)
  },
  pagePrev ({ commit, state, dispatch }) {
    const { pagination } = state
    const { current } = pagination
    if (current > 1) {
      commit('setPagination', { ...pagination, current: current - 1 })
    }
  },
  pageChange ({ commit, state, dispatch }, pagination) {
    commit('setPagination', pagination)
    dispatch('getList')
  },
  resetPagination ({ commit, dispatch }) {
    commit('resetPagination')
  },
  resetSearchParams ({ commit, dispatch }) {
    commit('resetSearchParams')
  },
  destroy ({ commit }) {
    commit('destroy')
  },
  async delete ({ state, dispatch }, { data, callback }) {
    await api.delete({ ids: data.id }).then(async () => {
      dispatch('getList')
    }).catch((err) => {
      message.error(err.message || '删除配置失败～')
    })
  },
  async batch ({ dispatch, state }, data) {
    const productCount = state.list.length
    const { op, selectIdList } = data
    switch (op.type) {
      case MEDICINE_REGISTER_BATCH_OPARATION_ENUM.DELETE: {
        const ids = selectIdList.map(item => item.id).join(',')
        const selectedCount = selectIdList.length
        await api.delete({ ids }).then(async () => {
          if (selectedCount >= productCount) {
            dispatch('pagePrev')
          }
          await sleep(1000)
          message.success(op.tip.success)
          dispatch('getList')
        }).catch((err) => {
          message.error(err.message || op.tip.error)
        })
      }
    }
  }
})
