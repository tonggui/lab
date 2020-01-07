import mergeModule from '@/store/helper/merge-module'
import createTagListStore from '@/store/modules/base-tag-list'

export default (api) => {
  const tagListStoreInstance = createTagListStore(api)
  return mergeModule(tagListStoreInstance, {
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
          commit('setError', true)
        } finally {
          commit('setLoading', false)
        }
      }
    }
  })
}
