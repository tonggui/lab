
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import productRecommendStore from './store'

console.log('productRecommendStore', productRecommendStore)
const moduleName = 'productRecommend'

export const register = () => store.registerModule(moduleName, productRecommendStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
