import createCategoryTemplateStore from '@/store/modules/category-template'
import api from './api'

const templateStoreInstance = createCategoryTemplateStore(api)

export default {
  namespaced: true,
  ...templateStoreInstance
}
