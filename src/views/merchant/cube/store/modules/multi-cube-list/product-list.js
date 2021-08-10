import {
  defaultPagination
} from '@/data/constants/common'
import {
  defaultTagId
} from '@/data/constants/poi'
import Vue from 'vue'

const initState = {
  loading: false, // 加载状态
  error: false, // 错误状态
  list: [], // 商品列表
  filters: {
    keyword: ''
  }, // 搜索商品信息
  pagination: { ...defaultPagination, pageSize: 50, 'show-total': true }, // 商品列表 分页信息
  tagId: defaultTagId, // 当前是的分类id
  parentTagId: 0,
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
      setParentTagId (state, payload) {
        state.parentTagId = payload
      },
      setScopeId (state, payload) {
        state.scopeId.cityId = payload.cityId
        state.scopeId.poiId = payload.poiId
      },
      setProductScope (state, payload) {
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
          const params = state.parentTagId === -1 || state.parentTagId === 0 || state.parentTagId === null ? {
            firstTagId: state.tagId,
            tabId: state.tabId,
            cityId: state.scopeId.cityId,
            poiId: state.scopeId.poiId,
            ...state.filters
          } : {
            firstTagId: state.parentTagId,
            secondTagId: state.tagId,
            tabId: state.tabId,
            cityId: state.scopeId.cityId,
            poiId: state.scopeId.poiId,
            ...state.filters
          }
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
          const message = Vue.prototype.$Message
          message.error(err.msg)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      pageChange ({ commit, dispatch }, pagination) {
        commit('setPagination', pagination)
        dispatch('getList')
      },
      tagIdChange ({ commit, dispatch }, payload) {
        commit('setTagId', payload.tagId)
        commit('setParentTagId', payload.parentId)
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