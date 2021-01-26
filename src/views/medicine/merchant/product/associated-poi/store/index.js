import { createNamespacedHelpers } from 'vuex'
import store from '@/store'
import associatedPoiStore from './store'

const moduleName = 'medicine-merchant-associated-poi'

export const register = () => store.registerModule(moduleName, associatedPoiStore)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
