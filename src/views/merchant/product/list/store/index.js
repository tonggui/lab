import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import createSortTagListStore from '@/store/modules/sort-tag-list'
import createSortProductListStore from './modules/product-list'
import { allProductTag } from '@/data/constants/poi'
import { findFirstLeaf } from '@/common/utils'
import api from './api'

const tagListStoreInstance = createSortTagListStore(api.tag)
const productListStoreInstance = createSortProductListStore(api.product)

const merchantProductListStore = {
  namespaced: true,
  state: {
    tagSorted: false,
    productSorted: false
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
      commit('product/sorting', sorting)
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
    getData ({ getters, dispatch }) {
      const tagId = getters['tagList/currentTagId']
      dispatch('getTagList')
      dispatch('product/tagIdChange', tagId)
      dispatch('getProductList')
    },
    changeProductTagId ({ dispatch, commit }, id) {
      commit('setProductSorted', false)
      dispatch('product/tagIdChange', id) // 更新商品管理的分类id
      dispatch('product/resetPagination') // 重置分页
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

const moduleName = 'merchantProductList'

store.subscribeAction({
  after: (action, _state) => {
    switch (action.type) {
      case `${moduleName}/tagList/select`:
        store.dispatch(`${moduleName}/changeProductTagId`, action.payload.id)
        break
      case `${moduleName}/product/delete`:
        store.dispatch(`${moduleName}/productDelete`)
        break
      case `${moduleName}/product/sort`:
        store.commit(`${moduleName}/setProductSorted`, true)
        break
      case `${moduleName}/tag/sort`:
        store.commit(`${moduleName}/setTagSorted`, true)
        break
    }
  }
})

export const register = () => store.registerModule(moduleName, merchantProductListStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
