import createTagListStore from './modules/tag-list'
import createProductListStore from './modules/product-list'
import mergeModule from '@/store/helper/merge-module'
import classifySelectedProductStore from './modules/classify-selected-product'
import api from './api'

const tagListStoreInstance = createTagListStore(api.tag)
const recommendProductListInstance = createProductListStore(api.product)
export default mergeModule({
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
}, classifySelectedProductStore)
