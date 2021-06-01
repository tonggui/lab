import mergeModule from '@/store/helper/merge-module'
import createTagListStore from '@/store/modules/base-tag-list'
import message from '@/store/helper/toast'

export default (api) => {
  const tagListStoreInstance = createTagListStore(api)
  return mergeModule(tagListStoreInstance, {
    state: {
      fullTagList: []
    },
    getters: {
      fullTagList (state) {
        return state.fullTagList
      }
    },
    mutations: {
      setFullTagList (state, list) {
        state.fullTagList = list
      }
    },
    actions: {
      async getList ({ commit }, query) {
        try {
          commit('setLoading', true)
          commit('setError', false)
          const { tagList, tagInfo } = await api.getList(query)
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
      },
      async getFullTagList ({ commit }) {
        const { tagList } = await api.getFullTagList()
        commit('setFullTagList', tagList)
      }
    }
  })
}
