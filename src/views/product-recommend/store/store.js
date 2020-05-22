import createTagListStore from './modules/tag-list'
import api from './api'

const tagListStoreInstance = createTagListStore(api.tag)

export default {
  namespaced: true,
  state: {
    filters: {
      keyword: '',
      isProductVisible: true
    }
  },
  actions: {
    getTagList ({ dispatch, state }) {
      dispatch('tagList/getList', state.filters)
    },
    getProductList ({ dispatch, state }) {
      dispatch('product/getList', state.filters)
    },
    getData ({ dispatch }) {
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
      namespaced: true
    }
  }
}
