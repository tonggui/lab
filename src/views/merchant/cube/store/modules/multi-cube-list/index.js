import createTagListStore from './tag-list'
import createProductListStore from './product-list'
import api from '../../api'
import { get } from 'lodash'

const { tab, scope } = api.multiCubeList
const tagListStoreInstance = createTagListStore(api.multiCubeList.tag)
const productListStoreInstance = createProductListStore(api.multiCubeList.product)

export default {
  namespaced: true,
  state: {
    currentTabId: '',
    tagSource: 0,
    tabList: [],
    scopeList: [],
    currentScope: {
      cityId: '',
      poiId: ''
    }
  },
  mutations: {
    setTabList (state, tabList) {
      state.tabList = tabList
    },
    setCurrentTab (state, currentTabId) {
      state.currentTabId = currentTabId
    },
    setTagSource (state, tagSource) {
      state.tagSource = tagSource
    },
    setScopeList (state, scopeList) {
      state.tabList = scopeList
    },
    setCurrentScope (state, currentScope) {
      state.currentScope = currentScope
    }
  },
  actions: {
    async getScopeList ({ dispatch, commit }) {
      const scopeList = await scope.getList() || []
      const currentScope = {
        cityId: -1,
        poiId: -1
      }
      commit('setScopeList', scopeList)
      dispatch('setCurrentScope', currentScope)
    },
    setCurrentScope ({ commit, dispatch }, currentScope) {
      commit('setCurrentScope', currentScope)
      dispatch('productList/setScope', currentScope)
    },
    async getTabList ({ dispatch, commit }) {
      const tabList = await tab.getList() || []
      const currentTab = get(tabList[0], 'id')
      const tagSource = get(tabList[0], 'tagSource')

      commit('setTabList', tabList)
      commit('setTagSource', tagSource)
      dispatch('setCurrentTab', currentTab)
    },
    setTagSource ({ state, commit }, tabId) {
      const tabList = state.tabList || []
      const tagSource = tabList.find(it => it.id === tabId).tagSource
      commit('setTagSource', tagSource)
    },
    setCurrentTab ({ commit, dispatch }, tabId) {
      commit('setCurrentTab', tabId)
      dispatch('setTagSource', tabId)
      dispatch('tagList/setTabId', tabId)
      dispatch('productList/setTabId', tabId)
      commit('productList/setPagination', { current: 1, total: 0 })
    },
    getTagList ({ dispatch, state }) {
      const filters = state.productList.filters
      dispatch('tagList/getList', filters)
    },
    getProductList ({ dispatch }) {
      dispatch('productList/getList')
    },
    getData ({ dispatch, commit, state }) {
      const tagId = state.tagList.currentTagId
      commit('productList/setTagId', tagId)
      dispatch('getTagList')
      dispatch('getProductList')
    },
    changeTag ({ commit, dispatch }, tagId) {
      commit('tagList/select', tagId)
      commit('productList/setTagId', tagId)
      commit('productList/setPagination', { current: 1 })
      dispatch('getProductList')
    },
    search ({ dispatch, commit }, filters) {
      // 重置分类 选中到全部商品
      dispatch('tagList/resetCurrentTag')
      // 设置商品 搜索条件
      commit('productList/setFilters', filters)
      commit('productList/setPagination', { current: 1 })
      dispatch('getData')
    },
    destroy ({ commit }) {
      commit('tagList/setList', [])
      commit('productList/setList', [])
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    },
    productList: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}
