import api from './api'
import message from '@/store/helper/toast'
import createProductListStore from '@/store/modules/product-list'
import createTagListStore from '@/store/modules/base-tag-list'
import { sleep } from '@/common/utils'

const productListStore = createProductListStore(api.product)
const tagListStore = createTagListStore(api.tag)

export default {
  namespaced: true,
  state: {
    autoApprove: false,
    keyword: ''
  },
  mutations: {
    setAutoApprove (state, autoApprove) {
      state.autoApprove = autoApprove
    },
    setKeyword (state, keyword) {
      state.keyword = keyword
    }
  },
  actions: {
    keywordSearch ({ commit, dispatch }, keyword) {
      console.log('keyword', keyword)
      commit('setKeyword', keyword)
      dispatch('getData')
    },
    getTagList ({ dispatch, state }) {
      const query = { keyword: state.keyword }
      dispatch('tag/getList', query)
    },
    getProduct ({ dispatch, state }) {
      const query = { keyword: state.keyword }
      dispatch('product/getList', query)
    },
    getData ({ dispatch, getters, commit }) {
      const tagId = getters.tagId // TODO 这个结果是undefined，为什么取这个值
      commit('product/setTagId', tagId)
      dispatch('getTagList')
      dispatch('getProduct')
      dispatch('getAutoApproveStatus')
    },
    async updateData ({ dispatch, state, commit }, count) {
      const { list, pagination } = state.product
      // 当前分类下是否还有待收录商品
      if (list.length <= count) {
        if (pagination.current > 1) {
          dispatch('product/pagePrev')
        } else {
          commit('product/resetTagId')
          dispatch('tag/resetCurrentTag')
        }
      }
      await sleep(1000)
      dispatch('getTagList')
      dispatch('getProduct')
    },
    async getAutoApproveStatus ({ commit }) {
      try {
        const status = await api.autoApprove.get()
        commit('setAutoApprove', status)
      } catch (err) {
        console.error(err)
        message.error(err.message)
      }
    },
    async setAutoApprove ({ commit }, status) {
      try {
        await api.autoApprove.set(status)
        commit('setAutoApprove', status)
      } catch (err) {
        console.error(err)
        message.error(err.message || '自动收录设置失败！')
      }
    },
    async includeProduct ({ dispatch }, productIdList) {
      await api.include(productIdList)
      dispatch('updateData')
    },
    async deleteProduct ({ dispatch }, { productIdList, isMerchant }) {
      await api.product.delete(productIdList, isMerchant)
      dispatch('updateData')
    },
    changeCurrentTag ({ dispatch, commit }, tagId) {
      dispatch('tag/select', tagId)
      commit('product/setTagId', tagId)
      commit('product/resetPagination')
      dispatch('getProduct')
    },
    destroy ({ dispatch }) {
      dispatch('product/destroy')
      dispatch('tag/destroy')
    }
  },
  modules: {
    product: {
      namespaced: true,
      ...productListStore
    },
    tag: {
      namespaced: true,
      ...tagListStore
    }
  }
}