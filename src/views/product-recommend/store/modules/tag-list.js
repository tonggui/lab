import mergeModule from '@/store/helper/merge-module'
import createTagListStore from '@/store/modules/base-tag-list'
import message from '@/store/helper/toast'

export default (api) => {
  const tagListStoreInstance = createTagListStore(api)
  return mergeModule(tagListStoreInstance, {
    state: {
      cachedTagList: []
    },
    mutations: {
      setCacheTagList (state, payload) {
        state.cachedTagList = Object.freeze(payload)
      }
    },
    actions: {
      async getList ({ commit }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList(query)
          if (!query.keyword) commit('setCacheTagList', tagList)
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
