import { findFirstLeaf } from '@/common/utils'
import { defaultPagination } from '@/data/constants/common'
import { productStatus, defaultProductStatus } from '@/data/constants/product'

const initState = {
  tag: {
    list: [],
    expandList: [],
    currentTag: undefined
  },
  product: {
    loading: false,
    error: false,
    pagination: { ...defaultPagination, showSizer: false, showElevator: false },
    list: [],
    status: defaultProductStatus,
    statusList: [...productStatus]
  }
}

export default (api) => {
  return {
    state: { ...initState },
    getters: {
      currentTagId (state) {
        return state.tag.currentTag.id
      }
    },
    mutations: {
      setTag (state, tag) {
        state.tag = tag
      },
      setExpandList (state, list) {
        state.tag.expandList = list
      },
      reset (state) {
        state = { ...state, ...initState }
      },
      setLoading (state, loading) {
        state.product.loading = !!loading
      },
      setError (state, error) {
        state.product.error = !!error
      },
      setProduct (state, product) {
        state.product = {
          ...state.product,
          ...product
        }
      },
      setPagination (state, pagination) {
        state.product.pagination = {
          ...state.product.pagination,
          ...pagination
        }
      },
      setStatus (state, status) {
        state.product.status = status
      },
      setCurrentTag (state, currentTag) {
        state.tag.currentTag = currentTag
      }
    },
    actions: {
      setTagList ({ commit, dispatch }, tagList) {
        tagList = tagList || []
        const currentTag = findFirstLeaf(tagList)
        const expandList = currentTag.level > 0 ? [currentTag.parentId] : []
        commit('setTag', {
          list: tagList,
          currentTag,
          expandList
        })
        if (currentTag) {
          dispatch('getProductList')
        }
      },
      async getProductList ({ state, commit, rootGetters }) {
        try {
          commit('setLoading', true)
          const { currentTag } = state.tag
          const template = rootGetters['categoryTemplate/template/currentTemplate']
          const { list, pagination, statusList } = await api.getProductList({
            currentTag,
            status: state.product.status,
            templateType: template.detail.type
          }, state.product.pagination, state.product.statusList)
          commit('setProduct', {
            list,
            pagination,
            statusList
          })
          commit('setError', false)
        } catch (err) {
          console.error(err)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      },
      changePagination ({ commit, dispatch }, pagination) {
        commit('setPagination', pagination)
        dispatch('getProductList')
      },
      changeStatus ({ commit, dispatch }, status) {
        commit('setStatus', status)
        dispatch('resetPagination')
        dispatch('getProductList')
      },
      resetPagination ({ commit }) {
        commit('setPagination', { current: 1 })
      },
      changeCurrentTag ({ commit, dispatch }, tag) {
        commit('setCurrentTag', tag)
        dispatch('resetPagination')
        dispatch('getProductList')
      },
      expandTag ({ commit }, list) {
        commit('setExpandList', list)
      }
    }
  }
}
