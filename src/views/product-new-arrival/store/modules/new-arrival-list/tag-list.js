import mergeModule from '@/store/helper/merge-module'
import createTagListStore from '@/store/modules/base-tag-list'
import message from '@/store/helper/toast'

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
      async getList ({ commit, state }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList({ tabId: state.tabId, ...query })
          const { productTotal } = tagInfo
          commit('setProductCount', productTotal)
          commit('setList', tagList)
        } catch (err) {
          console.error(err)
          message.error(err.message)
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      }
    }
  })
}
