import createSortTagListStore from '@/store/modules/sort-tag-list'
import createSortProductListStore from './modules/product-list'
import { allProductTag } from '@/data/constants/poi'
import { findFirstLeaf } from '@/common/utils'
import api from './api'

const tagListStoreInstance = createSortTagListStore(api.tag)
const productListStoreInstance = createSortProductListStore(api.product)

export default {
  namespaced: true,
  state: {
    tagSorted: false,
    productSorted: false,
    searchData: {}
  },
  getters: {
    sorting (state) {
      return state.product.sorting
    },
    // 当前是否选中的是 全部商品 分类
    isSelectAllProductTag (_state, getters) {
      const { currentTag } = getters
      return currentTag.id === allProductTag.id
    },
    // 当前选中的分类
    currentTag (state) {
      return state.tagList.currentTag
    },
    tagList (state) {
      return state.tagList.list
    }
  },
  mutations: {
    setTagSorted (state, sorted) {
      state.tagSorted = !!sorted
    },
    setProductSorted (state, sorted) {
      state.productSorted = !!sorted
    }
  },
  actions: {
    setSorting ({ commit, getters, dispatch }, sorting) {
      commit('product/setSorting', sorting)
      const { isSelectAllProductTag } = getters
      /**
       * 开启排序
       * 如果当前选择的是全部分类，需要命中到第一个叶子分类，全部商品不允许排序
       */
      if (sorting && isSelectAllProductTag) {
        const { tagList } = getters
        const firstTag = findFirstLeaf(tagList)
        dispatch('tagList/select', firstTag)
      } else {
        dispatch('getProductList')
      }
      if (!sorting) {
        commit('setTagSorted', false)
        commit('setProductSorted', false)
      }
    },
    // 获取分类列表
    getTagList ({ dispatch }) {
      dispatch('tagList/getList')
    },
    // 获取商品列表
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    // 初始化数据
    getData ({ getters, dispatch, commit }) {
      const tagId = getters['tagList/currentTagId']
      commit('product/setTagId', tagId)
      dispatch('getTagList')
      dispatch('getProductList')
    },
    changeProductTagId ({ dispatch, commit }, id) {
      commit('setProductSorted', false)
      commit('product/setTagId', id) // 更新商品管理的分类id
      commit('product/resetPagination') // 重置分页
      dispatch('getProductList') // 拉分类下商品
    },
    /**
    * 删除商品的时候 会影响分类数据 所以需要拉分类
    */
    async productDelete ({ dispatch }) {
      dispatch('getTagList')
      dispatch('getProductList')
    },
    destroy ({ commit }) {
      commit('product/setList', [])
      commit('tagList/setList', [])
    },
    async asyncTagList ({ commit }, { isSelectAll, poiIdList }) {
      await api.tag.asyncSequence({ isSelectAll, poiIdList })
      commit('setTagSorted', false)
    },
    async asyncProductList ({ commit, state }, { isSelectAll, poiIdList }) {
      const tagId = state.tagList.currentTag.id
      await api.product.asyncSequence(tagId, { isSelectAll, poiIdList })
      commit('setProductSorted', false)
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
