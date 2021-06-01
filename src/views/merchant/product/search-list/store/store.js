import api from './api'
import createProductListStore from './modules/product-list'
import createTagListStore from './modules/tag-list'

const productListStore = createProductListStore(api.product)
const tagListStore = createTagListStore(api.tag)

export default {
  namespaced: true,
  actions: {
    getTagList ({ dispatch, state }) {
      const { filters } = state.product
      dispatch('tag/getList', filters)
      dispatch('tag/getFullTagList')
    },
    getProduct ({ dispatch }) {
      dispatch('product/getList')
    },
    getData ({ dispatch, state, commit }) {
      const tagId = state.tag.currentTagId
      commit('product/setTagId', tagId)
      dispatch('getTagList')
      dispatch('getProduct')
    },
    destroy ({ dispatch }) {
      dispatch('product/destroy')
      dispatch('tag/destroy')
    },
    changeCurrentTag ({ dispatch, commit }, tagId) {
      dispatch('tag/select', tagId)
      commit('product/setTagId', tagId)
      commit('product/resetPagination')
      dispatch('getProduct')
    },
    changeFilters ({ dispatch, commit }, { keyword, brandId, tagId }) {
      if (!tagId) {
        commit('product/resetTagId')
      } else {
        commit('product/setTagId', tagId)
      }
      commit('product/setFilters', { keyword, brandId })
      commit('product/resetPagination')
      dispatch('getData')
    },
    initFilters ({ commit }, { keyword, brandId, tagId }) {
      if (tagId) {
        commit('product/setTagId', tagId)
        commit('tag/select', tagId)
      }
      commit('product/setFilters', { keyword, brandId })
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...productListStore
    },
    tag: {
      namespaced: true,
      ...tagListStore
    }
  }
}
