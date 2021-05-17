import message from '@/store/helper/toast'
import { cloneDeep } from 'lodash'
import api from './api'
import * as helper from './helper'
import {
  defaultTagId,
  defaultAutoClearStockConfig
} from '@/data/constants/poi'
import {
  defaultPagination
} from '@/data/constants/common'
import { getPoiId, getMerchantId, getRuleId } from '@/common/constants'

const initState = {
  submitting: false,
  loading: false,
  error: false,
  status: false,
  config: {
    ...defaultAutoClearStockConfig
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
  },
  ruleRelProduct: {}
}

export default {
  namespaced: true,
  state: cloneDeep(initState),
  mutations: {
    setError (state, error) {
      state.error = !!error
    },
    setLoading (state, loading) {
      state.loading = !!loading
    },
    setSubmitting (state, submitting) {
      state.submitting = !!submitting
    },
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
    },
    setRuleRelProductMap (state, ruleRelProductMap) {
      state.ruleRelProductMap = ruleRelProductMap
    },
    destory (state) {
      state = Object.assign(state, cloneDeep(initState))
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
    async getRuleRelProduct ({ commit, state }, ruleId) {
      const merchantId = getMerchantId() || 0
      try {
        let res = await api.getRuleRelProduct(ruleId, getPoiId(), merchantId)
        let ruleRelProductMap = {}
        if (res && res.tagStats) {
          res.tagStats.map((item, i) => {
            if (item.includes) {
              item.includes.map((id) => {
                ruleRelProductMap[id] = true
              })
            }
          })
          commit('setRuleRelProductMap', ruleRelProductMap)
        }
      } catch (err) {
        console.error(err)
      }
    },
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
            if (!arr.children || arr.children.length <= 0) {
              let node
              if (productMap[arr.id]) {
                node = { ...productMap[arr.id], total: arr.productCount }
              } else {
                node = { total: arr.productCount, checked: false, list: [] }
              }
              newProductMap[arr.id] = node
            } else {
              travser(arr.children)
            }
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
      const ruleId = getRuleId()
      try {
        commit('setProductLoading', true)
        commit('setProductError', false)
        const { list, pagination } = await api.product.getList({ tagId }, state.product.pagination)
        const newList = (list || []).map((product) => {
          // 选中全部分类中
          let tagIdList = [tagId]
          if (getters.isSelectAllProductTag) {
            tagIdList = product.tagList.map(tag => tag.id)
          }
          let checked = helper.getProductState(product, state.productMap, tagIdList)
          let disabled = false
          if (!checked && product.limitRuleId + '' === ruleId) {
            checked = true
          } else if (!checked && product.limitRuleId) {
            disabled = true
          }
          return { ...product, _checked: checked, _disabled: disabled }
        })
        console.log('newList', newList)
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
      const { status, config, productMap } = await api.getConfig(getPoiId())
      commit('setStatus', status)
      commit('setConfig', config)
      commit('setProductMap', productMap)
    },
    async getData ({ dispatch, commit }) {
      try {
        commit('setLoading', true)
        commit('setError', false)
        // await dispatch('getConfig')
        dispatch('getTagList')
        dispatch('getProductList')
      } catch (err) {
        console.error(err)
        commit('setError', true)
      } finally {
        commit('setLoading', false)
      }
    },
    changeTag ({ commit, dispatch }, tagId) {
      commit('setCurrentTagId', tagId)
      commit('setProductPagination', { current: 1 })
      dispatch('getProductList')
    },
    changePage ({ commit, dispatch }, pagination) {
      commit('setProductPagination', pagination)
      dispatch('getProductList')
    },
    toggleSelect ({ commit, getters, state }, { product, status }) {
      let tagIdList = [getters.currentTagId]
      if (getters.isSelectAllProductTag) {
        tagIdList = product.tagList.map(tag => tag.id)
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
          return prev
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
    async submit ({ state, commit }, callback) {
      try {
        const { status, config, productMap } = state
        if (status) {
          if (config.type.length <= 0) {
            message.warning('请选择取消订单方式')
            return
          }
          const { count } = helper.getAllTagStatus(productMap)
          if (count <= 0) {
            message.warning('请选择所需要设置的商品')
            return
          }
        }
        commit('setSubmitting', true)
        await api.saveConfig(status, config, productMap)
        callback()
      } catch (err) {
        console.error(err)
        message.error(err.message)
      } finally {
        commit('setSubmitting', false)
      }
    }
  }
}
