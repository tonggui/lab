import createTagListStore from './tag-list'
import createProductListStore from './product-list'
import api from '../../api'
import { get } from 'lodash'

const { tab } = api.multiCubeList
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
      cityId: -1,
      poiId: -1
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
      state.scopeList = scopeList
    },
    setCurrentScope (state, currentScope) {
      state.currentScope.cityId = currentScope.cityId
      state.currentScope.poiId = currentScope.poiId
      console.log(state.currentScope)
    }
  },
  actions: {
    getScopeList ({ dispatch, commit }) {
      let cityList = []
      const optionsShop = [
        { id: -1, name: 'all', cityId: -1, cityName: 'quanguo' },
        { id: 1, name: '711', cityId: 110, cityName: 'beijing' },
        { id: 2, name: '722', cityId: 120, cityName: 'tianjin' },
        { id: 3, name: '733', cityId: 120, cityName: 'tianjin' }
      ]
      optionsShop.forEach(item => {
        let city = cityList.some(ele => ele.cityId === item.cityId)
        if (!city) {
          const tmp = {
            cityName: item.cityName,
            cityId: item.cityId,
            poiList: [{
              id: item.id,
              name: item.name
            }]
          }
          cityList.push(tmp)
        } else {
          cityList.forEach((ele, index) => {
            if (ele.cityId === item.cityId) {
              ele.poiList.push({
                id: item.id,
                name: item.name
              })
            }
          })
        }
      })
      const currentScope = {
        cityId: -1,
        poiId: -1
      }
      commit('setScopeList', cityList)
      dispatch('setCurrentScope', currentScope)
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
    setCurrentScope ({ commit, dispatch }, currentScope) {
      commit('setCurrentScope', currentScope)
      dispatch('getTabList')
      commit('productList/setScope', currentScope)
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
