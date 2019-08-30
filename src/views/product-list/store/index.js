import { merge } from 'lodash'
import tagListStore from '@/store/modules/tag-list'
import productListStore from '@/store/modules/product-list'
import { PLATFORM } from '@/data/enums/common'
import { findFirstLeaf } from '@/common/utils'
import {
  fetchSubmitToggleTagToTop,
  fetchSubmitUpdateTagSequence
} from '@/data/repos/category'

const tagListStoreInstance = tagListStore(PLATFORM.PRODUCT)

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
      dispatch('getProductList')
    },
    changeTag ({ dispatch }, tag) {
      dispatch('tagList/select', tag)
      dispatch('product/tagIdChange', tag.id)
      dispatch('getProductList')
    }
  },
  mutations: {
    sorting (state, payload) {
      state.sorting = payload
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...merge(tagListStoreInstance, {
        actions: {
          async sort ({ commit, state }, { tagList, sortList, tag }) {
            if (state.sortInfo.isSmartSort) {
              const smartTagList = tagList.filter(item => item.isSmartSort)
              let sequence = smartTagList.length - 1
              if (tag.isSmartSort) {
                sequence = smartTagList.findIndex(item => item.id === tag.id)
              }
              await fetchSubmitToggleTagToTop(tag.id, tag.isSmartSort, sequence)
            } else {
              await fetchSubmitUpdateTagSequence(sortList.map(tag => tag.id))
            }
            commit('setList', tagList)
          }
        }
      })
    },
    product: {
      namespaced: true,
      ...productListStore
    }
  }
}
