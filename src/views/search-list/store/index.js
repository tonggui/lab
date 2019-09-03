import productListStore from '@/store/modules/product-list'
import listApi from '@/store/modules/product-list/api/product'
// import { fetchGetProductInfoList } from '@/data/repos/product'

const productListStoreInstance = productListStore(listApi)

export default {
  namespaced: true,
  state: {
    loading: false,
    filter: {
      tagId: 0, // TODO
      keyword: '',
      brandId: ''
    },
    tagList: {
      loading: false,
      error: false,
      list: []
    }
  },
  mutations: {
    loading (state, payload) {
      state.loading = !!payload
    }
  },
  actions: {
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    async getData ({ getters, dispatch }) {
      // const tagId = getters['tagList/currentTagId']
      // dispatch('getTagList')
      // dispatch('product/tagIdChange', tagId)
      // const pagination = getters['product/pagination']
      // const {  } = await fetchGetSearchProductInfoList(this.filter, pagination)
    },
    changeTag ({ dispatch }, tag) {
      dispatch('tagList/select', tag)
      dispatch('product/tagIdChange', tag.id)
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}
