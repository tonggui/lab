import multiCubeListStore from './modules/multi-cube-list'
import multiCubeEditStore from './modules/multi-cube-edit'
import {
  arrayUniquePush,
  arrayUniquePop,
  arrayToMap,
  arrayRemoveItem
} from '../utils'
import { getPriorityTag, isEmptyArray } from '@/views/product-recommend/utils'
import * as _ from 'lodash'
export default {
  namespaced: true,
  state: {
    classifySelectedProducts: {} // 商品选择信息 { [tagId]: { sequence, name, productList } }
  },
  mutations: {
    setClassifySelectedProducts (state, map) {
      state.classifySelectedProducts = map
    }
  },
  actions: {
    toggleSelectProduct ({ commit, state, rootState }, { productList, selected }) {
      const map = { ...state.classifySelectedProducts }
      productList.forEach(product => {
        if (!product.hasOwnProperty('addedPoiIds')) {
          product['addedPoiIds'] = []
        }
        const { tagList } = product
        if (isEmptyArray(tagList)) {
          return
        }
        const { id, name, sequence } = getPriorityTag(tagList)
        if (!map[id]) {
          map[id] = { name, sequence, productList: [] }
        }
        const productList = [...map[id].productList]
        const existProduct = _.find(productList, item => {
          return item.__id__ === product.__id__
        })
        let currentScope = state.multiCubeList.currentScope
        if (selected === 'selected') {
          // 将当前范围下未关联的门店&&可关联门店 加入待关联门店中
          if (currentScope.poiId !== -1) {
            product['addedPoiIds'].push(currentScope.poiId)
          } else {
            let canRelatePoiIds = product.totalPoiIds.filter(item => product['relatedPoiIds'].indexOf(item) === -1)
            canRelatePoiIds.forEach(item => {
              if (product['addedPoiIds'].indexOf(item) === -1) {
                product['addedPoiIds'].push(item)
              }
            })
          }
          if (existProduct) {
            // 已在已选列表
            existProduct['addedPoiIds'] = product['addedPoiIds']
          } else {
            map[id].productList = arrayUniquePush(productList, product, (p) => p.__id__)
          }
        } else if (selected === 'deselected') {
          // 从待关联门店中移除当前范围下未关联的门店
          console.log(product)
          existProduct.totalPoiIds.forEach(item => {
            arrayRemoveItem(existProduct['addedPoiIds'], item)
          })
          // 待关联门店数=0，已选商品列表移除该商品 || 选择城市全部，已选商品列表移除该商品，已选商品数量-1
          if (existProduct['addedPoiIds'].length === 0 || (currentScope.cityId === -1 && currentScope.poiId === -1)) {
            map[id].productList = arrayUniquePop(productList, product, (p) => p.__id__)
          }
        } else {
          map[id].productList = arrayUniquePop(productList, product, (p) => p.__id__)
        }
      })
      commit('setClassifySelectedProducts', map)
    },
    poiRelatingRangeChange ({ state, commit }, productList) {
      const map = { ...state.classifySelectedProducts }
      productList.forEach((product) => {
        const { tagList } = product
        if (isEmptyArray(tagList)) {
          return
        }
        const { id } = getPriorityTag(tagList)
        if (map[id] && map[id].productList) {
          map[id].productList.forEach(item => {
            if (item.__id__ === product.__id__) {
              if (item.addedPoiIds) item.addedPoiIds = product.addedPoiIds
            }
          })
        }
      })
      commit('setClassifySelectedProducts', map)
    },
    // 切换城市时，更新已选列表中的product的totalPoiIds
    updateSelectedProducts ({ state, commit, rootState }) {
      const rowProductList = multiCubeListStore.state.productList.list
      const map = { ...state.classifySelectedProducts }
      for (let key in map) {
        let productList = map[key].productList
        productList.forEach(product => {
          const totalPoiIds = _.result(_.find(rowProductList, item => {
            return item.__id__ === product.__id__
          }), 'totalPoiIds')
          product.totalPoiIds = totalPoiIds
        })
      }
      commit('setClassifySelectedProducts', map)
    },
    selectProduct ({ dispatch }, productList) {
      dispatch('toggleSelectProduct', { productList, selected: 'selected' })
    },
    deSelectProduct ({ dispatch }, productList) {
      dispatch('toggleSelectProduct', { productList, selected: 'deselected' })
    },
    deleteSelectProduct ({ dispatch }, productList) {
      dispatch('toggleSelectProduct', { productList, selected: 'delete' })
    },
    clearSelected ({ commit }) {
      commit('setClassifySelectedProducts', {})
    },
    destroyStatus ({ dispatch, commit }) {
      dispatch('clearSelected')
      commit('multiCubeList/tagList/destroy')
      commit('multiCubeList/productList/destroy')
    },
    setEditProductList ({ commit }, productList) {
      const map = arrayToMap(productList)
      commit('multiCubeEdit/setEditProductInfoMap', map)
    }
  },
  modules: {
    multiCubeList: {
      namespaced: true,
      ...multiCubeListStore
    },
    multiCubeEdit: {
      namespaced: true,
      ...multiCubeEditStore
    }
  }
}
