import tagListStore from '@/store/modules/tag-list'
import productListStore from './modules/sort-product-list'
import api from './api'
import { findFirstLeaf } from '@/common/utils'

const tagListStoreInstance = tagListStore(api.tag)
const productListStoreInstance = productListStore(api.product)

export default {
  namespaced: true,
  getters: {
    sorting (state) {
      return state.product.sorting // 排序状态在 product 模块
    },
    totalProductCount (state) {
      return state.tagList.productCount
    },
    loading (state) {
      return state.tagList.loading || state.product.loading
    },
    tagList (state) {
      return state.tagList.list
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
      dispatch('product/resetPagination')
      dispatch('getProductList')
    },
    changeTag ({ dispatch }, tag) {
      dispatch('tagList/select', tag)
      dispatch('product/tagIdChange', tag.id)
      dispatch('product/resetPagination')
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
      ...productListStoreInstance
    }
  }
}
