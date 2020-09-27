import newArrivalListStore from './modules/new-arrival-list'
import newArrivalEditStore from './modules/new-arrival-edit'
import {
  getPriorityTag,
  isEmptyArray,
  arrayUniquePush,
  arrayUniquePop,
  arrayToMap
} from '../utils'

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
    toggleSelectProduct ({ commit, state }, { productList, selected }) {
      const map = { ...state.classifySelectedProducts }
      productList.forEach(product => {
        const { tagList } = product
        if (isEmptyArray(tagList)) {
          return
        }
        const { id, name, sequence } = getPriorityTag(tagList)
        if (!map[id]) {
          map[id] = { name, sequence, productList: [] }
        }
        const productList = [...map[id].productList]
        if (selected) {
          map[id].productList = arrayUniquePush(productList, product, (p) => p.__id__)
        } else {
          map[id].productList = arrayUniquePop(productList, product, (p) => p.__id__)
        }
      })
      commit('setClassifySelectedProducts', map)
    },
    selectProduct ({ dispatch }, productList) {
      console.log('productList', productList)
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
      commit('newArrivalList/tagList/destroy')
      commit('newArrivalList/productList/destroy')
    },
    setEditProductList ({ commit }, productList) {
      const map = arrayToMap(productList)
      commit('newArrivalEdit/setEditProductInfoMap', map)
    }
  },
  modules: {
    newArrivalList: {
      namespaced: true,
      ...newArrivalListStore
    },
    newArrivalEdit: {
      namespaced: true,
      ...newArrivalEditStore
    }
  }
}
