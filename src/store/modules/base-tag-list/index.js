import {
  allProductTag
} from '@/data/constants/poi'
import message from '@/store/helper/toast'

let initState = {
  loading: false, // 加载状态
  error: false, // 错误标志
  list: [], // 分类列表
  currentTagId: allProductTag.id,
  expandList: [], // 当前展开的分类idList
  productCount: 0 // 门店商品总数
}

export default (api, defaultState = {}) => {
  initState = { ...initState, ...defaultState }
  return ({
    state () {
      return { ...initState }
    },
    getters: {
      tagListError (state) {
        return state.error
      },
      currentTagId (state) {
        return state.currentTagId
      },
      list (state) {
        return state.list
      }
    },
    mutations: {
      setLoading (state, payload) {
        state.loading = !!payload
      },
      setError (state, payload) {
        state.error = !!payload
      },
      select (state, id) {
        state.currentTagId = id
      },
      setProductCount (state, payload) {
        state.productCount = payload
      },
      setList (state, payload) {
        state.list = Object.freeze(payload)
      },
      setExpandList (state, payload) {
        state.expandList = payload
      },
      destroy (state) {
        state = Object.assign(state, { ...initState })
      }
    },
    actions: {
      async getList ({ commit }) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList()
          const { productTotal } = tagInfo
          commit('setProductCount', productTotal)
          commit('setList', tagList)
        } catch (err) {
          console.error(err)
          message.error(err.message)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      select ({ commit }, id) {
        commit('select', id)
      },
      expand ({ commit }, expandList) {
        commit('setExpandList', expandList)
      },
      resetCurrentTag ({ commit }) {
        commit('select', allProductTag.id)
      },
      destroy ({ commit }) {
        commit('destroy')
      }
    }
  })
}
