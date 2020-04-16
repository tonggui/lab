import api from './api'
import createProductListStore from './modules/product-list'
import { TAB, TAB_LABEL } from '../constants'

const initState = {
  tagList: [],
  taskDone: false,
  activeTab: '',
  keyword: '',
  tabList: [],
  loading: false,
  error: false
}

export default {
  namespaced: true,
  state () {
    return { ...initState }
  },
  getters: {
    empty (state) {
      return !state.loading && state.tabList.length <= 0
    },
    spuId (state, _getters, rootState) {
      const route = rootState.route
      if (!route) {
        return
      }
      return route.query.spuId
    },
    taskName (state, _getters, rootState) {
      const route = rootState.route
      if (!route) {
        return
      }
      return route.query.spuName
    },
    awardInfo (state, _getters, rootState) {
      const route = rootState.route
      if (!route) {
        return
      }
      return {
        awardCode: route.query.awardCode,
        awardTypeCode: route.query.awardTypeCode
      }
    }
  },
  mutations: {
    setTagList (state, tagList) {
      state.tagList = tagList || []
    },
    setKeyword (state, keyword) {
      state.keyword = keyword || ''
    },
    setActiveTab (state, activeTab) {
      state.activeTab = activeTab
    },
    setLoading (state, loading) {
      state.loading = !!loading
    },
    setError (state, error) {
      state.error = !!error
    },
    setTabList (state, tabList) {
      state.tabList = tabList
    },
    setTaskDone (state, done) {
      state.taskDone = !!done
    },
    destory (state) {
      Object.assign(state, { ...initState })
    }
  },
  actions: {
    async init ({ commit, dispatch, getters }) {
      dispatch('getTaskInfo')
      dispatch('getTagList')
      try {
        commit('setLoading', true)
        commit('setError', false)
        const { spuId, awardInfo } = getters
        const { existProductCount, newProductCount } = await api.getTabList(spuId, awardInfo)
        let activeTab = ''
        const tabList = []
        // 存在已有商品，默认tab为已有商品
        if (existProductCount > 0) {
          activeTab = TAB.EXIST
          tabList.push({
            id: TAB.EXIST,
            label: TAB_LABEL[TAB.EXIST]
          })
          commit(`${TAB.EXIST}/init`, { spuId, awardInfo })
        }

        if (newProductCount > 0) {
          activeTab = activeTab || TAB.NEW
          tabList.push({
            id: TAB.NEW,
            label: TAB_LABEL[TAB.NEW]
          })
          commit(`${TAB.NEW}/init`, { spuId, awardInfo })
        }
        commit('setActiveTab', activeTab)
        commit('setTabList', tabList)
      } catch (err) {
        console.error(err)
        commit('setError', true)
      } finally {
        commit('setLoading', false)
      }
    },
    async getTaskInfo ({ commit, getters }) {
      try {
        const { spuId, awardInfo } = getters
        // TODO
        const { status } = await api.getTaskInfo(spuId, awardInfo)
        // TODO
        commit('setTaskDone', status === 1)
      } catch (err) {
        console.error(err)
        commit('setTaskDone', false)
      }
    },
    async getTagList ({ commit }) {
      try {
        const tagList = await api.getTagList()
        commit('setTagList', tagList)
      } catch (err) {
        console.error(err)
        commit('setTagList', [])
      }
    },
    search ({ state, commit, dispatch }, keyword = '') {
      const { activeTab } = state
      if (!activeTab) {
        return
      }
      if (keyword !== state.keyword) {
        commit('setKeyword', keyword)
      }
      dispatch(`${activeTab}/search`, keyword)
    },
    changeTab ({ commit, state, dispatch }, tab) {
      commit('setActiveTab', tab)
      const { keyword } = state[tab]
      if (keyword !== state.keyword) {
        dispatch('search', state.keyword)
      }
    },
    finishTask ({ commit }) {
      commit('setTaskDone', true)
    },
    destroy ({ commit }) {
      commit('destory')
      commit(`${TAB.EXIST}/destory`)
      commit(`${TAB.NEW}/destory`)
    }
  },
  modules: {
    [TAB.EXIST]: {
      namespaced: true,
      ...createProductListStore(api[TAB.EXIST])
    },
    [TAB.NEW]: {
      namespaced: true,
      ...createProductListStore(api[TAB.NEW])
    }
  }
}
