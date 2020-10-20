import createSortProductListStore from './modules/product-list/index'
import api from './api'

const productListStoreInstance = createSortProductListStore(api.product)

export default {
  namespaced: true,
  state: {
    tagSorted: false,
    productSorted: false
  },
  getters: {
    sorting (state) {
      return state.product.sorting
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
    // setSorting ({ commit, getters, dispatch }, sorting) {
    //   dispatch('getProductList')
    //   // }
    //   if (!sorting) {
    //     commit('setTagSorted', false)
    //     commit('setProductSorted', false)
    //   }
    // },
    // 获取分类列表
    // getTagList ({ dispatch }) {
    //   dispatch('tagList/getList')
    // },
    // 获取商品列表
    getProductList ({ dispatch }) {
      dispatch('product/getList')
    },
    // 初始化数据
    getData ({ getters, dispatch, commit }) {
      // const tagId = getters['tagList/currentTagId']
      // commit('product/setTagId', tagId)
      // dispatch('getTagList')
      dispatch('getProductList')
    },
    // changeProductTagId ({ dispatch, commit }, id) {
    //   commit('setProductSorted', false)
    //   commit('product/setTagId', id) // 更新商品管理的分类id
    //   commit('product/resetPagination') // 重置分页
    //   dispatch('getProductList') // 拉分类下商品
    // },
    /**
    * 删除商品的时候 会影响分类数据 所以需要拉分类
    */
    async productDelete ({ dispatch }) {
      // dispatch('getTagList')
      dispatch('getProductList')
    },
    destroy ({ commit }) {
      commit('product/setList', [])
      // commit('tagList/setList', [])
    },
    // async asyncTagList ({ commit }, { isSelectAll, poiIdList }) {
    //   await api.tag.asyncSequence({ isSelectAll, poiIdList })
    //   commit('setTagSorted', false)
    // },
    async asyncProductList ({ commit, state }, { isSelectAll, poiIdList }) {
      // const tagId = state.tagList.currentTag.id
      // await api.product.asyncSequence(tagId, { isSelectAll, poiIdList })
      // commit('setProductSorted', false)
    }
  },
  modules: {
    // tagList: {
    //   namespaced: true,
    //   ...tagListStoreInstance
    // },
    product: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}
