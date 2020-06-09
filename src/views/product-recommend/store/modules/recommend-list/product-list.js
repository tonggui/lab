import {
  defaultPagination
} from '@/data/constants/common'
import {
  defaultTagId
} from '@/data/constants/poi'
import message from '@/store/helper/toast'

const initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  filters: {
    keyword: ''
  }, // 搜索商品信息
  pagination: { ...defaultPagination, pageSize: 50, 'show-total': true }, // 商品列表 分页信息
  tagId: defaultTagId // 当前是的分类id
}

export default (api) => {
  return {
    state: {
      ...initState
    },
    mutations: {
      setLoading (state, payload) {
        state.loading = !!payload
      },
      setError (state, payload) {
        state.error = !!payload
      },
      setList (state, payload) {
        state.list = Object.freeze(payload)
      },
      setTagId (state, payload) {
        state.tagId = payload
      },
      setPagination (state, payload) {
        state.pagination = {
          ...state.pagination,
          ...payload
        }
      },
      setFilters (state, filters) {
        state.filters = { ...state.filters, ...filters }
      },
      destroy (state) {
        state = Object.assign(state, { ...initState })
      }
    },
    actions: {
      destroy ({ commit }) {
        commit('destroy')
      },
      selectProduct ({ dispatch }, products) {
        dispatch('productRecommend/selectProduct', products, { root: true })
      },
      deSelectProduct ({ dispatch }, products) {
        dispatch('productRecommend/deSelectProduct', products, { root: true })
      },
      async getList ({ state, commit, dispatch }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const params = {
            tagId: state.tagId,
            ...state.filters
          }
          const result = await api.getList(state.pagination, params)
          const { pageSize, current } = state.pagination
          const { total } = result.pagination
          /**
           * 商品请求的分页数目 溢出当前商品总数 需要重新获取
           */
          if (current > 1 && pageSize * (current - 1) >= total) {
            const newCurrent = Math.ceil(total / pageSize)
            commit('setPagination', {
              ...result.pagination,
              current: newCurrent
            })
            dispatch('getList')
            return
          }
          commit('setList', result.list || [])
          commit('setPagination', result.pagination)
        } catch (err) {
          console.error(err)
          message.error(err.message)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      pageChange ({ commit, dispatch }, pagination) {
        commit('setPagination', pagination)
        dispatch('getList')
      },
      tagIdChange ({ commit, dispatch }, tagId) {
        commit('setTagId', tagId)
        commit('setPagination', { current: 1 })
        dispatch('getList')
      }
    }
  }
}
