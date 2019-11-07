import productListStore from './modules/product-list'
import api from './api'
import { sleep } from '@/common/utils'
import { fetchGetProductInfoList } from '@/data/repos/product'
import { fetchGetTagList } from '@/data/repos/category'
import message from '@/store/modules/helper/toast'
import lx from '@/common/lx/lxReport'

const productListStoreInstance = productListStore(api)

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
    loading (state, payload) {
      state.loading = !!payload
    },
    error (state, payload) {
      state.error = !!payload
    },
    tagList (state, payload) {
      state.tagList = payload
    },
    productCount (state, payload) {
      state.productCount = payload
    },
    poiTagList (state, payload) {
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
        commit('poiTagList', poiTagList)
      }
    },
    async getData ({ commit, state }) {
      try {
        commit('loading', true)
        commit('product/loading', true)
        const product = state.product
        const { tagList, productTotal, list, statusList, pagination } = await fetchGetProductInfoList({
          needTag: true,
          status: product.status,
          tagId: product.tagId,
          sorter: product.sorter,
          ...product.filters
        }, product.pagination, product.statusList)
        commit('tagList', tagList)
        commit('productCount', productTotal)
        commit('product/setList', list)
        commit('product/statusList', statusList)
        commit('product/pagination', pagination)
        commit('error', false)
        lx.mv('b_shangou_online_e_kthpf02y_mv', { status: 1 })
      } catch (err) {
        message.error(err.message)
        commit('error', true)
        lx.mv('b_shangou_online_e_kthpf02y_mv', { status: 0 })
      } finally {
        commit('loading', false)
        commit('product/loading', false)
      }
    },
    async batch ({ dispatch, state }, params) {
      await dispatch('product/batch', params)
      await sleep(1000)
      dispatch('product/getList')
    },
    async delete ({ dispatch }, params) {
      await dispatch('product/delete', params)
      dispatch('product/getList')
    },
    changeTag ({ dispatch }, tagId) {
      dispatch('product/tagIdChange', tagId)
      dispatch('product/resetPagination')
      dispatch('product/getList')
    },
    submitFilters ({ dispatch, state }, filters) {
      dispatch('product/changeFilters', filters)
      if (state.product.filters.keyword !== filters.keyword) {
        dispatch('product/resetTagId')
      }
      dispatch('product/resetStatus')
      dispatch('product/resetPagination')
      dispatch('getData')
    },
    clearFilters ({ dispatch }) {
      dispatch('product/clearFilters')
    },
    setInitData ({ dispatch, state, commit }, { keyword, tagId, brandId, status }) {
      const product = state.product
      const { filters } = product
      let needRefresh = false
      if (filters.keyword !== keyword || filters.brandId !== brandId) {
        dispatch('product/clearFilters')
        dispatch('product/changeFilters', { keyword, brandId })
        needRefresh = true
      }
      if (tagId !== product.tagId) {
        if (tagId) {
          commit('product/tagId', tagId)
        } else {
          dispatch('product/resetTagId')
        }
        needRefresh = true
      }
      if (status !== product.status) {
        commit('product/status', status)
        needRefresh = true
      }
      if (needRefresh) {
        dispatch('product/reset')
      }
    },
    destroy ({ commit }) {
      commit('tagList', [])
      commit('poiTagList', [])
      commit('product/setList', [])
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...productListStoreInstance
    }
  }
}
