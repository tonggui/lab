import multiCubeListStore from './modules/multi-cube-list'
import multiCubeEditStore from './modules/multi-cube-edit'
import {
  arrayUniquePush,
  arrayUniquePop,
  arrayToMap,
  arrayRemoveItem
} from '../utils'
import { getPriorityTag, isEmptyArray } from '@/views/product-recommend/utils'

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
      console.log(state.classifySelectedProducts)
      productList.forEach(product => {
        if (!product.hasOwnProperty('relatingPoiIds')) {
          product['relatingPoiIds'] = []
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
        let currentScope = state.multiCubeList.currentScope
        let poiIds = state.multiCubeList.currentPoiIds
        if (selected) {
          if (currentScope.poiId !== -1) {
            product['relatingPoiIds'].push(poiIds[0])
          } else {
            let canRelatePoiIds = product.totalPoiIds.filter(item => product['relatedPoiIds'].indexOf(item) === -1)
            canRelatePoiIds.forEach(item => {
              if (poiIds.indexOf(item) !== -1) {
                product['relatingPoiIds'].push(item)
              }
            })
          }
          map[id].productList = arrayUniquePush(productList, product, (p) => p.__id__)
        } else {
          poiIds.forEach(item => {
            arrayRemoveItem(product['relatingPoiIds'], item)
          })
          if (product['relatingPoiIds'].length === 0) {
            map[id].productList = arrayUniquePop(productList, product, (p) => p.__id__)
          }
        }
      })
      commit('setClassifySelectedProducts', map)
    },
    selectProduct ({ dispatch }, productList) {
      dispatch('toggleSelectProduct', { productList, selected: true })
    },
    deSelectProduct ({ dispatch }, productList) {
      dispatch('toggleSelectProduct', { productList, selected: false })
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
