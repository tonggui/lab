import multiCubeListStore from './modules/multi-cube-list'
import multiCubeEditStore from './modules/multi-cube-edit'
import {
  arrayUniquePush,
  arrayUniquePop,
  arrayToMap
} from '../utils'
import { TAG_SOURCE } from '@/data/enums/product'
import { get } from 'lodash'

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
        const { category, tagSource = 0 } = product
        const [firstCategory = { id: '', name: '' }] = category[tagSource]
        const thirdCategoryId = get(category[TAG_SOURCE.SYSTEM], '[2].id')
        if (!thirdCategoryId) return
        const { id = '', name = '' } = firstCategory
        const { sequence, customSequence } = product
        if (!map[id]) {
          map[id] = { name, sequence: tagSource === TAG_SOURCE.SYSTEM ? sequence : customSequence, productList: [] }
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
