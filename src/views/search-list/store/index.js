import tagListStore from '@/store/modules/tag-list'
import tagApi from '@/store/modules/tag-list/api/product'
import productListStore from '@/store/modules/product-list'
import listApi from '@/store/modules/product-list/api/product'

const tagListStoreInstance = tagListStore(tagApi)
const productListStoreInstance = productListStore(listApi)

export default {
  namespaced: true,
  actions: {
    getTagList ({ dispatch }) {
      dispatch('tagList/getList')
    },
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    getData ({ getters, dispatch }) {
      const tagId = getters['tagList/currentTagId']
      dispatch('getTagList')
      dispatch('product/tagIdChange', tagId)
    },
    changeTag ({ dispatch }, tag) {
      dispatch('tagList/select', tag)
      dispatch('product/tagIdChange', tag.id)
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    },
    product: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}
