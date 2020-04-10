import api from './api'
import createProductListStore from './modules/product-list'
import { TAB, TAB_LABEL } from '../constants'

export default {
  namespaced: true,
  state () {
    return {
      tagList: [],
      taskDone: false,
      activeTab: '',
      keyword: '',
      tabList: [],
      loading: false,
      error: false
    }
  },
  getters: {
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
    }
  },
  actions: {
    async init ({ commit, dispatch, getters }) {
      dispatch('getTaskInfo')
      dispatch('getTagList')
      try {
        commit('setLoading', true)
        commit('setError', false)
        const { spuId } = getters
        const { existProductCount } = await api.getTabList(spuId)
        let activeTab = TAB.NEW
        const tabList = []
        // 存在已有商品，默认tab为已有商品
        if (existProductCount > 0) {
          activeTab = TAB.EXIST
          tabList.push({
            id: TAB.EXIST,
            label: TAB_LABEL[TAB.EXIST]
          })
          commit(`${TAB.EXIST}/setSpuId`, spuId)
        }
        tabList.push({
          id: TAB.NEW,
          label: TAB_LABEL[TAB.NEW]
        })
        commit(`${TAB.NEW}/setSpuId`, spuId)

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
    search ({ state, commit, dispatch }, keyword) {
      const { activeTab } = state
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
