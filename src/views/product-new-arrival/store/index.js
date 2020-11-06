import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import productNewArrivalStore from './store'

const moduleName = 'productNewArrival'

export const register = () => store.registerModule(moduleName, productNewArrivalStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
