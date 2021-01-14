import { createNamespacedHelpers } from 'vuex'
import store from '@/store'
import searchListStore from './store'

const moduleName = 'medicine-merchant-search-list'

export const register = () => store.registerModule(moduleName, searchListStore)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
