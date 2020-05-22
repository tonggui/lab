import createTagListStore from '@/store/modules/base-tag-list'
import api from './api'

const tagListStoreInstance = createTagListStore(api.tag)
console.log('tagListStoreInstance', tagListStoreInstance)
export default {
  namespaced: true,
  state: {},
  modules: {
    tagList: {
      namespaced: true,
      ...tagListStoreInstance
    }
  }
}
