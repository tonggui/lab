import createTagListStore from './tag-list'
import createProductListStore from './product-list'
import { get } from 'lodash'
import api from '../../api'

const { tag, product, tab } = api.newArrivalList

const tagListStoreInstance = createTagListStore(tag)
const productListStoreInstance = createProductListStore(product)

export default {
  namespaced: true,
  state: {
    currentTabId: '',
    tabList: []
  },
  mutations: {
    setTabList (state, tabList) {
      state.tabList = tabList
    },
    setCurrentTab (state, currentTabId) {
      state.currentTabId = currentTabId
    }
  },
  actions: {
    async getTabList ({ dispatch, commit }) {
      const tabList = await tab.getList() || []
      const currentTab = get(tabList[0], 'id')
      dispatch('setCurrentTab', currentTab)
      commit('setTabList', tabList)
    },
    setCurrentTab ({ commit, dispatch }, tabId) {
      commit('setCurrentTab', tabId)
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
    search ({ dispatch, commit, state }, filters) {
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