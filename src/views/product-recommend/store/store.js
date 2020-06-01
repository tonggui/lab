import recommendListStore from './modules/recommend-list'
import recommendEditStore from './modules/recommend-edit'
import {
  getPriorityTag,
  isEmptyArray,
  arrayUniquePush,
  arrayUniquePop
} from '../utils'

export default {
  namespaced: true,
  state: {
    classifySelectedProducts: {} // 商品选择信息 { [tagId]: { sequence, name, productList } }
  },
  getters: {
    selectedProductTagGroupList (state) {
      const list = []
      const sortedList = Object.entries(state.classifySelectedProducts).sort(([key, value], [nextKey, nextValue]) => {
        return value.sequence - nextValue.sequence
      })
      sortedList.forEach(([key, value]) => {
        if (value.productList.length > 0) {
          list.push(({ id: key, ...value }))
        }
      })
      return list
    }
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
        console.log('name', name)
        if (!map[id]) {
          map[id] = { name, sequence, productList: [] }
        }
        const productList = [...map[id].productList]
        if (selected) {
          map[id].productList = arrayUniquePush(productList, product)
        } else {
          map[id].productList = arrayUniquePop(productList, product)
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
    }
  },
  modules: {
    recommendList: {
      namespaced: true,
      ...recommendListStore
    },
    recommendEdit: {
      namespaced: true,
      ...recommendEditStore
    }
  }
}
