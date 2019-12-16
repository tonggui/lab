import createTagListStore from '@/store/modules/tag-list'
import createSortProductListStore from '@/store/modules/sort-product-list'
import api from './api'
import { findFirstLeaf, sleep } from '@/common/utils'
import { allProductTag } from '@/data/constants/poi'
import { PRODUCT_BATCH_OP } from '@/data/enums/product'
import store from '@/store'
import {
  POI_HOT_RECOMMEND,
  CATEGORY_TEMPLATE
} from '@/module/moduleTypes'

const tagListStoreInstance = createTagListStore(api.tag)
const productListStoreInstance = createSortProductListStore(api.product)

store.subscribeAction({
  after: (action, _state) => {
    switch (action.type) {
      case 'productList/tagList/select':
        store.dispatch('productList/changeProductTagId', action.payload.id)
        break
      case 'productList/product/batch':
        store.dispatch('productList/productBatch', action.payload)
        break
      case 'productList/product/delete':
        store.dispatch('productList/productDelete')
        break
    }
  }
})

export default {
  namespaced: true,
  getters: {
    sorting (state) {
      return state.product.sorting // 排序状态在 product 模块
    },
    // 门店商品 总数 在分类 module XD
    totalProductCount (state) {
      if (state.tagList.loading) {
        return Infinity
      }
      return state.tagList.productCount
    },
    tagList (state) {
      return state.tagList.list
    },
    /**
     * 门店 是否命中 热卖推荐
     * 热卖推荐条件：接口开关获取 + 门店总商品 <= 5 (商品总数需要在tagList 获取完成之后)
     */
    isNewPoiRecommend (_state, getters, _rootState, rootGetters) {
      const { totalProductCount } = getters
      const hotRecommend = rootGetters.moduleStates(POI_HOT_RECOMMEND)
      return totalProductCount <= 5 && !!hotRecommend
    },
    /**
     * 是否支持分类模版
     *  接口获取分类模版灰度开关 + 没有正在进行中的任务
     */
    supportCategoryTemplate (_state, getters, _rootState, rootGetters) {
      const { categoryTemplateTaskApplying } = getters
      return !categoryTemplateTaskApplying && rootGetters.moduleStates(CATEGORY_TEMPLATE)
    },
    /*
    * 是否展示分类模版的引导弹框
    * 条件：接口获取分类模版灰度开关 + 门店商品 <= 5 + 没有正在进行中的任务
    * 门店商品判断需要在 分类信息加载完成
    */
    showCategoryTemplateGuideModal (_state, getters) {
      const { totalProductCount, supportCategoryTemplate } = getters
      return totalProductCount <= 5 && supportCategoryTemplate
    },
    // 当前是否选中的是 全部商品 分类
    isSelectAllProductTag (_state, getters) {
      const { currentTag } = getters
      return currentTag.id === allProductTag.id
    },
    // 当前选中的分类
    currentTag (state) {
      return state.tagList.currentTag
    }
  },
  actions: {
    /**
     * 切换排序mode
     */
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
    },
    // 获取分类列表
    getTagList ({ dispatch }) {
      dispatch('tagList/getList')
    },
    // 获取商品列表
    getProductList ({ dispatch, state }) {
      dispatch('product/getList')
    },
    // 初始化数据
    getData ({ getters, dispatch }) {
      const tagId = getters['tagList/currentTagId']
      dispatch('getTagList')
      dispatch('product/tagIdChange', tagId)
      dispatch('getProductList')
    },
    /*
    * 批量操作 更新
    * 只有删除和修改分类的时候需要刷新分类，牵扯到分类数据变化
    */
    async productBatch ({ dispatch, state }, params) {
      const { type } = params
      // TODO 只有删除和修改分类的时候需要刷新分类，牵扯到分类数据变化
      if (type === PRODUCT_BATCH_OP.DELETE || type === PRODUCT_BATCH_OP.MOD_TAG) {
        dispatch('getTagList')
      }
      // TODO 批量删除的时候 删除了本页所有数据 需要分页往前推一页
      if (type === PRODUCT_BATCH_OP.DELETE) {
        const productCount = state.product.list.length
        const selectedCount = params.idList.length
        if (selectedCount >= productCount) {
          dispatch('product/pagePrev')
        }
      }
      await sleep(1000)
      dispatch('getProductList')
    },
    /**
    * 删除商品的时候 会影响分类数据 所以需要拉分类
    */
    async productDelete ({ dispatch }) {
      dispatch('getTagList')
      dispatch('getProductList')
    },
    changeProductTagId ({ dispatch }, id) {
      dispatch('product/tagIdChange', id) // 更新商品管理的分类id
      dispatch('product/resetPagination') // 重置分页
      dispatch('getProductList') // 拉分类下商品
    },
    destroy ({ commit }) {
      commit('product/setList', [])
      commit('tagList/setList', [])
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
