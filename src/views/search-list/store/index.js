import productListStore from './modules/product-list'
import api from './api'
import { sleep } from '@/common/utils'
import { fetchGetProductInfoList } from '@/data/repos/product'
import { fetchGetTagList } from '@/data/repos/category'
import message from '@/store/helper/toast'
import lx from '@/common/lx/lxReport'
import { get, isEqual } from 'lodash'
import { productStatus } from '@/data/constants/product'
import store from '@/store'
import { isEditLimit } from '@/common/product/editLimit'
import extend from '@/store/helper/merge-module'
import { PRODUCT_SELL_STATUS } from '@/data/enums/product'
import { decodeParamsFromURLSearch } from '@/common/constants'

const productListStoreInstance = productListStore(api)

store.subscribeAction({
  after: (action, _state) => {
    switch (action.type) {
      case 'searchList/product/modify':
        store.dispatch('searchList/productModify', action.payload)
    }
  }
})

export default {
  namespaced: true,
  state: {
    loading: false,
    error: false,
    tagList: [],
    productCount: 0,
    poiTagList: [] // 门店的所用分类 用于批量修改分类使用
  },
  getters: {
    tagId (state) {
      return state.product.tagId
    },
    filters (state) {
      return state.product.filters
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = !!payload
    },
    setError (state, payload) {
      state.error = !!payload
    },
    setTagList (state, payload) {
      state.tagList = payload
    },
    setProductCount (state, payload) {
      state.productCount = payload
    },
    setPoiTagList (state, payload) {
      state.poiTagList = payload || []
    }
  },
  actions: {
    async getPoiTagList ({ commit }) {
      let poiTagList = []
      try {
        poiTagList = await fetchGetTagList()
      } catch (err) {
        console.error(err)
      } finally {
        commit('setPoiTagList', poiTagList)
      }
    },
    async getData ({ commit, state }) {
      try {
        commit('setLoading', true)
        commit('product/setLoading', true)
        commit('setError', false)
        const product = state.product
        const { tagList, productTotal, list, statusList, pagination } = await fetchGetProductInfoList({
          needTag: true,
          status: product.status,
          tagId: product.tagId,
          sorter: product.sorter,
          ...product.filters
        }, product.pagination, product.statusList)
        commit('setTagList', tagList)
        commit('setProductCount', productTotal)
        commit('product/setList', list)
        commit('product/setStatusList', statusList)
        commit('product/setPagination', pagination)
        lx.mv('b_shangou_online_e_kthpf02y_mv', { status: 1 })
      } catch (err) {
        message.error(err.message)
        commit('setError', true)
        lx.mv('b_shangou_online_e_kthpf02y_mv', { status: 0 })
      } finally {
        commit('setLoading', false)
        commit('product/setLoading', false)
      }
    },
    async batch ({ dispatch }, params) {
      await dispatch('product/batch', params)
      await sleep(1000)
      dispatch('product/getList')
    },
    async delete ({ dispatch }, params) {
      await dispatch('product/delete', params)
      dispatch('product/getList')
    },
    productModify ({ dispatch }, payload) {
      const { params } = payload
      if ('sellStatus' in params) {
        dispatch('product/getList')
      }
    },
    changeTag ({ dispatch, commit }, tagId) {
      commit('product/setTagId', tagId)
      commit('product/resetPagination')
      dispatch('product/getList')
    },
    submitFilters ({ dispatch, state, commit }, filters) {
      const keyword = state.product.filters.keyword
      dispatch('product/changeFilters', filters)
      if (keyword !== filters.keyword) {
        commit('product/resetTagId')
      }
      // 存在statusList的tabs的时候需要重置，否则会影响 分类信息
      if (state.product.statusList.length > 0) {
        commit('product/resetStatus')
      }
      commit('product/resetPagination')
      dispatch('getData')
    },
    clearFilters ({ dispatch }) {
      dispatch('product/clearFilters')
    },
    setInitData ({ dispatch, state, commit }, { keyword, tagId, brandId, status }) {
      const product = state.product
      const { filters } = product
      const prevQuery = {
        keyword: filters.keyword,
        brandId: filters.brandId,
        tagId: product.tagId,
        status: product.status
      }
      const newQuery = {
        keyword,
        brandId,
        tagId,
        status
      }
      if (!isEqual(prevQuery, newQuery)) {
        commit('product/resetStatus')
        commit('product/resetPagination')
        commit('product/resetSorter')
      }
      // 更新 filter
      if (filters.keyword !== keyword || filters.brandId !== brandId) {
        dispatch('product/clearFilters')
        dispatch('product/changeFilters', { keyword, brandId })
      }
      // 更新tagId
      if (tagId !== product.tagId) {
        if (tagId) {
          commit('product/setTagId', tagId)
        } else {
          commit('product/resetTagId')
        }
      }
      if (status && status !== product.status) {
        commit('product/setStatus', status)
        // 非白底图片和信息不全的商品 会从 商品监控 进入到搜索列表页
        // 但是这两种不在tabs中，所有不在tabs中的状态下就直接隐藏tab
        const statusInclude = productStatus.find(item => item.id === status)
        commit('product/setStatusList', statusInclude ? productStatus : [])
      }
    },
    destroy ({ commit }) {
      commit('setTagList', [])
      commit('setPoiTagList', [])
      commit('product/destroy', [])
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...extend(productListStoreInstance, {
        actions: {
          async modify ({ state, commit }, { product, params }) {
            const queryApi = api.modify
            const context = {
              productStatus: state.status,
              tagId: state.tagId
            }
            let res = true
            // 活动卡控
            if ('name' in params) {
              res = await isEditLimit(queryApi, {
                extra: context,
                product,
                params: { ...params, checkActivitySkuModify: true }
              })
            }
            typeof res === 'boolean' && res && await queryApi(product, params, context)
            if (params.sellStatus === PRODUCT_SELL_STATUS.ON) {
              lx.mv({
                bid: 'b_shangou_online_e_tf37a6ez_mv',
                val: {
                  spu_id: product.id,
                  st_spu_id: product.spId || 0,
                  create_source: decodeParamsFromURLSearch('awardCode') ? 5 : 0,
                  task_id: get(decodeParamsFromURLSearch('awardCode'), 'taskId'),
                  page_source: window.page_source
                }
              })

              if (window.searchListStartTime && window.page_source === 3) {
                lx.mv({
                  bid: 'b_shangou_online_e_k05yimbk_mv',
                  val: {
                    spu_id: product.id,
                    st_spu_id: product.spId || 0,
                    viewtime: (Date.now() - window.searchListStartTime) / 1000,
                    task_id: get(decodeParamsFromURLSearch('awardCode'), 'taskId'),
                    page_source: window.page_source
                  }
                })

                window.searchListStartTime = null
              }
            }
            commit('modify', { ...product, ...params })
          }
        }
      })
    }
  }
}
