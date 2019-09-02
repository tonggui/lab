import tagListStore from '@/store/modules/tag-list'
import tagApi from '@/store/modules/tag-list/api/product'
import productListStore from '@/store/modules/product-list'
import listApi from '@/store/modules/product-list/api/product'
import { findFirstLeaf } from '@/common/utils'

const tagListStoreInstance = tagListStore(tagApi)
const productListStoreInstance = productListStore(listApi)

export default {
  namespaced: true,
  getters: {
    sorting (state) {
      return state.product.sorting
    },
    totalProductCount (state) {
      return state.tagList.productCount
    }
  },
  actions: {
    setSorting ({ commit, getters, dispatch }, sorting) {
      commit('product/sorting', sorting)
      const isSelectAllProductTag = getters['tagList/isSelectAllProductTag']
      if (isSelectAllProductTag) {
        const tagList = getters['tagList/list']
        const firstTag = findFirstLeaf(tagList)
        dispatch('changeTag', firstTag)
      } else {
        dispatch('getProductList')
      }
    },
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
