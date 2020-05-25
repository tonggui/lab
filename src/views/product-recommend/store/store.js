import createTagListStore from './modules/tag-list'
import recommendProductListInstance from './modules/product-list'
import api from './api'

const tagListStoreInstance = createTagListStore(api.tag)

console.log('tagListStoreInstance', tagListStoreInstance)
export default {
  namespaced: true,
  state: {
    filters: {
      keyword: '',
      isProductVisible: true
    }
  },
  mutations: {
    setKeyWord (state, filters) {
      Object.assign(state.filters, filters)
    }
  },
  actions: {
    getTagList ({ dispatch, state }) {
      dispatch('tagList/getList', state.filters)
    },
    getProductList ({ dispatch, state }) {
      dispatch('product/getList', state.filters)
    },
    getData ({ dispatch, commit }, filters = {}) {
      commit('setKeyWord', filters)
      dispatch('getTagList')
      dispatch('getProductList')
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    },
    product: {
      namespaced: true,
      ...recommendProductListInstance
    }
  }
}
