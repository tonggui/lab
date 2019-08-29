import tagListStore from '@/store/modules/tag-list'
import productListStore from '@/store/modules/product-list'
import { PLATFORM } from '@/data/enums/common'

const tagListStoreInstance = tagListStore(PLATFORM.PRODUCT)

export default {
  namespaced: true,
  actions: {
    getTagList ({ dispatch }) {
      dispatch('tagList/getList')
    },
    getProductList ({ dispatch, state }) {
      if (state.sorting) {
        dispatch('product/getSortList')
      } else {
        dispatch('product/getList')
      }
    },
    getData ({ getters, dispatch }) {
      const tagId = getters['tagList/currentTagId']
      dispatch('getTagList')
      dispatch('product/tagIdChange', tagId)
      dispatch('getProductList')
    },
    changeTag ({ dispatch }, tag) {
      dispatch('tagList/select', tag)
      dispatch('product/tagIdChange', tag.id)
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
      ...productListStore
    }
  }
}
