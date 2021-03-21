
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import productStore from './modules'

const moduleName = 'newBatchRel'

export const register = () => store.registerModule(moduleName, productStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
