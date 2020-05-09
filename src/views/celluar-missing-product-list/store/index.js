
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import celluaMissingProductListStore from './store'

const moduleName = 'celluarMissingProductList'

export const register = () => store.registerModule(moduleName, celluaMissingProductListStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
