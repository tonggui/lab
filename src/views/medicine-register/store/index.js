
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import medicineRegisterStore from './store'

const moduleName = 'medicineRegister'

export const register = () => store.registerModule(moduleName, medicineRegisterStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
