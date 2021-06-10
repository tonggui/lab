
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import productMultiCubeRecommendStore from './store'

const moduleName = 'productMultiCubeRecommend'

export const register = () => store.registerModule(moduleName, productMultiCubeRecommendStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
