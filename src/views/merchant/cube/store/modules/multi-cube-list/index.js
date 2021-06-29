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
    rowScopeList: [],
    currentPoiIds: [],
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
    setRowScopeList (state, rowScopeList) {
      state.rowScopeList = rowScopeList
    },
    setCurrentScope (state, currentScope) {
      let data = Object.assign({}, state.currentScope, currentScope)
      state.currentScope = data
    },
    setCurrentPoiIds (state, poiIds) {
      state.currentPoiIds = poiIds
    }
  },
  actions: {
    async getScopeList ({ dispatch, commit }) {
      let cityList = []
      const optionsShop = await scope.getList() || []
      optionsShop.unshift({ id: -1, name: '全国所有门店', cityId: -1, cityName: '全国' })
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
      commit('setRowScopeList', optionsShop)
      commit('setScopeList', cityList)
      dispatch('setCurrentScope', currentScope)
    },
    async getTabList ({ state, dispatch, commit }) {
      const param = { cityId: state.currentScope.cityId, poiId: state.currentScope.poiId }
      const tabList = await tab.getList(param) || []
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
    setCurrentScope ({ state, commit, dispatch }, currentScope) {
      commit('setCurrentScope', currentScope)
      let poiIds = []
      // 当前所选范围对应的门店id
      if (currentScope.poiId !== -1) {
        poiIds.push(currentScope.poiId)
      } else if (currentScope.cityId !== -1) {
        let cityItem = state.scopeList.find(item => item.cityId === currentScope.cityId)
        cityItem.poiList.forEach(item => {
          if (item.id !== -1) poiIds.push(item.id)
        })
      } else {
        state.rowScopeList.forEach(item => {
          if (item.id !== -1) poiIds.push(item.id)
        })
      }
      commit('setCurrentPoiIds', poiIds)
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
    changeTag ({ commit, dispatch }, payload) {
      console.log(payload)
      commit('tagList/select', payload.tagId)
      commit('productList/setTagId', payload.tagId)
      commit('productList/setParentTagId', payload.parentId)
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
