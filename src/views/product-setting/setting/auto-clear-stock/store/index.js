import api from './api'
import * as helper from './helper'
import {
  defaultTagId
} from '@/data/constants/poi'
import {
  defaultPagination
} from '@/data/constants/common'

export default {
  namespaced: true,
  state: {
    status: false,
    config: {
      type: [1, 2],
      syncStatus: true,
      syncTime: '00:00',
      stock: null
    },
    productMap: {},
    tag: {
      list: [],
      error: false,
      loading: false,
      currentTagId: defaultTagId
    },
    product: {
      list: [],
      error: false,
      loading: false,
      pagination: { ...defaultPagination }
    }
  },
  mutations: {
    setProductError (state, error) {
      state.product.error = !!error
    },
    setProductList (state, list) {
      state.product.list = list
    },
    setProductLoading (state, loading) {
      state.product.loading = loading
    },
    setProductMap (state, productMap) {
      state.productMap = productMap
    },
    setConfig (state, config) {
      state.config = config
    },
    setStatus (state, status) {
      state.status = !!status
    },
    setTagLoading (state, loading) {
      state.tag.loading = !!loading
    },
    setTagError (state, error) {
      state.tag.error = !!error
    },
    setProductPagination (state, pagination) {
      state.product.pagination = {
        ...state.product.pagination,
        ...pagination
      }
    },
    setCurrentTagId (state, tagId) {
      state.tag.currentTagId = tagId
    },
    setTagList (state, tagList) {
      state.tag.list = tagList
    }
  },
  getters: {
    currentTagState (state) {
      const { productMap } = state
      const tagId = state.tag.currentTagId
      if (tagId === defaultTagId) {
        return helper.getAllTagStatus(productMap)
      }
      return helper.getTagStatus(tagId, productMap)
    },
    // 当前是否选中的是 全部商品 分类
    isSelectAllProductTag (_state, getters) {
      const { currentTagId } = getters
      return currentTagId === defaultTagId
    },
    // 当前选中的分类
    currentTagId (state) {
      return state.tag.currentTagId
    }
  },
  actions: {
    async getTagList ({ commit, state }) {
      try {
        commit('setTagLoading', true)
        commit('setTagError', false)
        const list = await api.tag.getList()
        commit('setTagList', list)
        const { productMap } = state
        const newProductMap = {}
        const travser = (arr) => {
          arr.forEach(arr => {
            let node
            if (productMap[arr.id]) {
              node = { ...productMap[arr.id], total: arr.productCount }
            } else {
              node = { total: arr.productCount, checked: false, list: [] }
            }
            newProductMap[arr.id] = node
          })
        }
        travser(list)
        commit('setProductMap', newProductMap)
      } catch (err) {
        console.error(err)
        commit('setTagError', true)
      } finally {
        commit('setTagLoading', false)
      }
    },
    async getProductList ({ commit, getters, state }) {
      const tagId = getters.currentTagId
      try {
        commit('setProductLoading', true)
        commit('setProductError', false)
        const { list, pagination } = await api.product.getList({ tagId }, state.product.pagination)
        const newList = (list || []).map((product) => {
          // 选中全部分类中
          let tagIdList = [tagId]
          if (getters.isSelectAllProductTag) {
            tagIdList = product.tagIdList
          }
          const checked = helper.getProductState(product, state.productMap, tagIdList)
          return { ...product, _checked: checked }
        })
        commit('setProductList', newList)
        commit('setProductPagination', pagination)
      } catch (err) {
        console.error(err)
        commit('setProductError', true)
      } finally {
        commit('setProductLoading', false)
      }
    },
    async getConfig ({ commit }) {
      const { status, config, productMap } = await api.getConfig()
      commit('setStatus', status)
      commit('setConfig', config)
      commit('setProductMap', productMap)
    },
    async getData ({ dispatch, state }) {
      await dispatch('getConfig')
      if (state.status) {
        dispatch('getTagList')
        dispatch('getProductList')
      }
    },
    changeTag ({ commit, dispatch }, tagId) {
      commit('setCurrentTagId', tagId)
      dispatch('getProductList')
    },
    changePage ({ commit }, pagination) {
      commit('setProductPagination', pagination)
    },
    toggleSelect ({ commit, getters, state }, { product, status }) {
      let tagIdList = [getters.currentTagId]
      if (getters.isSelectAllProductTag) {
        tagIdList = product.tagIdList
      }
      const newMap = helper.toggleStatusProduct(status, product, tagIdList, state.productMap)
      commit('setProductMap', newMap)
    },
    toggleSelectAll ({ commit, getters, state }, status) {
      let newMap = {}
      if (getters.isSelectAllProductTag) {
        newMap = Object.entries(state.productMap).reduce((prev, [key, value]) => {
          prev[key] = {
            checked: status,
            list: [],
            total: value.total
          }
        }, {})
      } else {
        const tagId = getters.currentTagId
        newMap = { ...state.productMap }
        newMap[tagId] = {
          checked: status,
          list: [],
          total: newMap[tagId].total
        }
      }
      const { list } = state.product
      const newList = list.map((p) => ({ ...p, _checked: status }))
      commit('setProductMap', newMap)
      commit('setProductList', newList)
    },
    async submit ({ state }) {
      const { status, config, productMap } = state
      await api.saveConfig(status, config, productMap)
    }
  }
}
