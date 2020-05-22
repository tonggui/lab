import createTagListStore from '@/store/modules/base-tag-list'
import api from './api'

const tagListStoreInstance = createTagListStore(api.tag)

export default {
  namespaced: true,
  state: {},
  actions: {
    getData ({ dispatch }) {
      dispatch('tagList/getList')
    }
  },
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    }
  }
}
