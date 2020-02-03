import { createNamespacedHelpers } from 'vuex'
import store from '@/store'
import approveListStore from './store'

const moduleName = 'merchant-approve-list'

export const register = () => store.registerModule(moduleName, approveListStore)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
