import { createNamespacedHelpers } from 'vuex'
import store from '@/store'
import message from '@/store/modules/helper/toast'
import {
  defaultPagination
} from '@/data/constants/common'
import { defaultData } from '../constants'
import api from './api'

const associatedPoiStore = {
  namespaced: true,
  state: {
    loading: false,
    error: false,
    product: {},
    poi: {
      list: [],
      error: false,
      loading: false,
      pagination: { ...defaultPagination }
    },
    filterData: { ...defaultData }
  },
  getters: {
    spuId (_state, _getters, rootState) {
      const query = rootState.route.query
      return Number(query.spuId)
    }
  },
  mutations: {
    setLoading (state, loading) {
      state.loading = !!loading
    },
    setError (state, error) {
      state.error = !!error
    },
    setProduct (state, product) {
      state.product = product
    },
    setFilterData (state, filterData) {
      state.filterData = filterData
    },
    setPoiList (state, list) {
      state.poi.list = list
    },
    setPoiLoading (state, loading) {
      state.poi.loading = !!loading
    },
    setPoiError (state, error) {
      state.poi.error = !!error
    },
    setPoiPagination (state, page) {
      state.poi.pagination = {
        ...state.poi.pagination,
        ...page
      }
    }
  },
  actions: {
    async getPoiList ({ commit, state, getters }) {
      try {
        commit('setPoiLoading', true)
        commit('setPoiError', false)
        const { filterData, poi } = state
        const { list, pagination } = await api.getList(getters.spuId, poi.pagination, filterData)
        commit('setPoiList', list)
        commit('setPoiPagination', pagination)
      } catch (err) {
        commit('setPoiError', true)
      } finally {
        commit('setPoiLoading', false)
      }
    },
    async getData ({ commit, state, getters }) {
      try {
        commit('setLoading', true)
        commit('setError', false)
        const { filterData, poi } = state
        const { list, pagination, product } = await api.getList(getters.spuId, poi.pagination, filterData)
        commit('setPoiList', list)
        commit('setPoiPagination', pagination)
        commit('setProduct', product)
      } catch (err) {
        commit('setError', true)
      } finally {
        commit('setLoading', false)
      }
    },
    async changeSellStatus ({ commit, state, getters }, { poiId, status, index }) {
      try {
        commit('setPoiLoading', true)
        await api.changeSellStatus(getters.spuId, [poiId], status)
        const poiList = state.poi.list
        poiList.splice(index, 1, {
          ...poiList[index],
          sellStatus: status
        })
        message.success('操作成功')
      } catch (err) {
        console.error(err)
        message.error(err.message)
      } finally {
        commit('setPoiLoading', false)
      }
    },
    async clearAssociated ({ commit, dispatch, getters }, poiId) {
      try {
        commit('setPoiLoading', true)
        await api.clearAssociated(getters.spuId, [poiId])
        message.success('取消成功')
        dispatch('getData')
      } catch (err) {
        console.error(err)
        message.error(err.message)
      } finally {
        commit('setPoiLoading', false)
      }
    },
    setFilterData ({ commit, dispatch }, filterData) {
      commit('setFilterData', filterData)
      commit('setPoiPagination', { current: 1 })
      dispatch('getPoiList')
    },
    changePagination ({ commit, dispatch }, page) {
      commit('setPoiPagination', page)
      dispatch('getPoiList')
    },
    async addAssociatedPoi ({ dispatch, state, getters }, poiList) {
      try {
        const addPoiIdList = []
        const product = state.product
        // 已经添加过的不提交
        poiList.forEach(item => {
          if (!product.poiIdList.includes(item.id)) {
            addPoiIdList.push(item.id)
          }
        })
        if (addPoiIdList.length <= 0) {
          throw Error('请选择新增关联的门店')
        }
        await api.addPoi(getters.spuId, addPoiIdList)
        message.success({
          content: '添加成功',
          duration: 2
        })
        setTimeout(() => {
          dispatch('getData')
        }, 2000)
      } catch (err) {
        console.error(err)
        const type = err.code ? 'error' : 'warning'
        message[type](err.message)
        throw err
      }
    }
  }
}
const moduleName = 'merchant-associated-poi'

export const register = () => store.registerModule(moduleName, associatedPoiStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = createNamespacedHelpers(moduleName)
