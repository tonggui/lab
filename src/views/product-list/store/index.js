import createSortTagListStore from '@/store/modules/sort-tag-list'
import createSortProductListStore from '@/store/modules/sort-product-list'
import extend from '@/store/helper/merge-module'
import api from './api'
import { isEditLimit } from '@/common/product/editLimit'
import { findFirstLeaf, sleep } from '@/common/utils'
import { allProductTag } from '@/data/constants/poi'
import { PRODUCT_BATCH_OP, PRODUCT_STATUS } from '@/data/enums/product'
import store from '@/store'
import storage, { KEYS } from '@/common/local-storage'

const tagListStoreInstance = createSortTagListStore(api.tag)
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
      case 'productList/product/modify':
        store.dispatch('productList/productModify', action.payload)
    }
  }
})

export default {
  namespaced: true,
  state: {
    init: true
  },
  mutations: {
    setInit (state, init) {
      state.init = !!init
    }
  },
  getters: {
    sorting (state) {
      return state.product.sorting // 排序状态在 product 模块
    },
    // 门店商品 总数 在分类 module XD
    totalProductCount (state) {
      if (state.tagList.loading || state.tagList.error) {
        return Infinity
      }
      return state.tagList.productCount
    },
    tagList (state) {
      return state.tagList.list
    },
    /*
    * 是否展示分类模版的引导弹框
    * 条件：接口获取分类模版灰度开关 + 门店商品 <= 5 + 没有正在进行中的任务
    * 门店商品判断需要在 分类信息加载完成
    */
    showCategoryTemplateGuideModal (_state, getters) {
      const { totalProductCount } = getters
      return !_state.init && totalProductCount <= 5
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
      // // TODO: 新增库存不足展开Tab
      // if (!storage[KEYS.PRODUCT_STOCK_INSUFFICIENT_COUNT]) {
      //   commit('product/setStatus', PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT)
      // }
      dispatch('getProductList')
      // TODO: 新增库存不足展开Tab, 非首次并且数量大于0
      const stockInsufficientInfo = getters['product/statusList'].find(i => i.id === PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT)
      console.log(getters['product/statusList'])
      console.log(stockInsufficientInfo)
      console.log(stockInsufficientInfo.count)
      if (!storage[KEYS.PRODUCT_STOCK_INSUFFICIENT_COUNT] && stockInsufficientInfo.count > 0) {
        console.log('到这里了')
        commit('product/setStatus', PRODUCT_STATUS.STOCK_INSUFFICIENT_COUNT)
        dispatch('getProductList')
      }
      commit('setInit', false)
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
    productModify ({ dispatch }, payload) {
      const { params } = payload
      if ('sellStatus' in params) {
        dispatch('getProductList')
      }
    },
    changeProductTagId ({ dispatch, commit }, id) {
      commit('product/setTagId', id) // 更新商品管理的分类id
      commit('product/resetPagination') // 重置分页
      dispatch('getProductList') // 拉分类下商品
    },
    destroy ({ commit }) {
      commit('setInit', true)
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
      ...extend(productListStoreInstance, {
        actions: {
          async modify ({ state, commit }, { product, params }) {
            const queryApi = api.product.modify
            const context = {
              productStatus: state.status,
              tagId: state.tagId
            }
            let res = true
            // 活动卡控
            if ('name' in params) {
              res = await isEditLimit(queryApi, { extra: context, product, params: { ...params, checkActivitySkuModify: true } })
            }
            typeof res === 'boolean' && res && await queryApi(product, params, context)
            commit('modify', { ...product, ...params })
          }
        }
      })
    }
  }
}
