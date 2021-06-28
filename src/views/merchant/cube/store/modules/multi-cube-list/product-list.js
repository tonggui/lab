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
  tagId: defaultTagId, // 当前是的分类id
  tabId: '', // 选中的tabId
  scopeId: {
    cityId: -1,
    poiId: -1
  },
  productScope: []
}

export default (api) => {
  return {
    state: {
      ...initState
    },
    mutations: {
      setScope (state, payload) {
        let data = Object.assign({}, state.scopeId, payload)
        state.scopeId = data
      },
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
      setScopeId (state, payload) {
        state.scopeId.cityId = payload.cityId
        state.scopeId.poiId = payload.poiId
      },
      setProductScope (state, payload) {
        // let productionId = payload.map(item => {
        //   return {
        //     id: item.id,
        //     scopeId: {
        //       cityId: state.scopeId.cityId,
        //       poiId: state.scopeId.poiId
        //     }
        //   }
        // })
        // console.log('==========')
        // console.log(productionId)
        state.productScope = payload
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
      },
      setTabId (state, tabId) {
        state.tabId = tabId
      }
    },
    actions: {
      setTabId ({ commit }, tabId) {
        commit('setTabId', tabId)
      },
      destroy ({ commit }) {
        commit('destroy')
      },
      selectProduct ({ dispatch }, products) {
        dispatch('productMultiCubeRecommend/selectProduct', products, { root: true })
      },
      deSelectProduct ({ dispatch }, products) {
        dispatch('productMultiCubeRecommend/deSelectProduct', products, { root: true })
      },
      async getList ({ rootState, state, commit, dispatch }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const params = {
            tagId: state.tagId,
            tabId: state.tabId,
            cityId: state.scopeId.cityId,
            poiId: state.scopeId.poiId,
            ...state.filters
          }
          // const params1 = {
          //   tagId: state.tagId,
          //   tabId: state.tabId,
          //   cityId: state.scopeId.cityId,
          //   poiId: state.scopeId.poiId,
          //   ...state.filters
          // }
          console.log(params)
          const result = await api.getList(state.pagination, params)
          const { pageSize, current } = state.pagination
          const { total } = result.pagination
          /**
           * 商品请求的分页数目 溢出当前商品总数 需要重新获取
           */
          if (current > 1 && pageSize * (current - 1) >= total) {
            const newCurrent = Math.ceil(total / pageSize) || 1
            commit('setPagination', {
              ...result.pagination,
              current: newCurrent
            })
            dispatch('getList')
            return
          }
          commit('setList', result.list || [])
          commit('setProductScope', result.list || [])
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
      },
      scopeChange ({ commit, dispatch }, scopeId) {
        commit('setScope', scopeId)
        commit('setPagination', { current: 1 })
        dispatch('getList')
      }
    }
  }
}
