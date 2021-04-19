import createTagListStore from './tag-list'
import createProductListStore from './product-list'
import api from '../api'

const tagListStoreInstance = createTagListStore(api.tag)
const productListStoreInstance = createProductListStore(api.product)

export default {
  namespaced: true,
  actions: {
    getTagList ({ dispatch, state }) {
      const filters = state.productList.filters
      dispatch('tagList/getList', filters)
    },
    getProductList ({ dispatch }) {
      dispatch('productList/getList')
    },
    getData ({ dispatch, commit, state }) {
      const tagId = state.tagList.currentTagId
      commit('productList/setTagId', tagId)
      dispatch('getTagList')
      dispatch('getProductList')
    },
    changeTag ({ commit, dispatch }, tagId) {
      commit('tagList/select', tagId)
      dispatch('productList/tagIdChange', tagId)
      // commit('productList/setTagId', tagId)
      // commit('productList/setPagination', { current: 1 })
      // dispatch('getProductList')
    },
    search ({ dispatch, commit }, filters) {
      // 重置分类 选中到全部商品
      // dispatch('tagList/resetCurrentTag')
      // 设置商品 搜索条件
      commit('productList/setFilters', filters)
      commit('productList/setPagination', { current: 1 })
      dispatch('getProductList')
    },
    destroy ({ commit }) {
      commit('tagList/setList', [])
      commit('productList/setList', [])
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    },
    productList: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}