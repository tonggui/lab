import mergeModule from '@/store/helper/merge-module'
import createTagListStore from '@/store/modules/base-tag-list'
import { get } from 'lodash'
import Vue from 'vue'

export default (api) => {
  const tagListStoreInstance = createTagListStore(api, {
    tabId: ''
  })
  return mergeModule(tagListStoreInstance, {
    mutations: {
      setTabId (state, tabId) {
        state.tabId = tabId
      }
    },
    actions: {
      setTabId ({ commit }, tabId) {
        commit('setTabId', tabId)
      },
      async getList ({ commit, state, rootState }, query) {
        try {
          const currentScope = get(rootState, 'productMultiCubeRecommend.multiCubeList.currentScope')
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList({ tabId: state.tabId, cityId: currentScope.cityId, poiId: currentScope.poiId, ...query })
          const { productTotal } = tagInfo
          commit('setProductCount', productTotal)
          commit('setList', tagList)
        } catch (err) {
          console.error(err)
          Vue.prototype.$Message.error(err.msg)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      }
    }
  })
}
