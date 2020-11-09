
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import multiStoreProductListStore from './store'

const moduleName = 'multiStoreProductList'

// store.subscribeAction({
//   after: (action, _state) => {
//     switch (action.type) {
//       case `${moduleName}/tagList/select`:
//         store.dispatch(`${moduleName}/changeProductTagId`, action.payload.id)
//         break
//       case `${moduleName}/product/delete`:
//         store.dispatch(`${moduleName}/productDelete`)
//         break
//       case `${moduleName}/product/sort`:
//         store.commit(`${moduleName}/setProductSorted`, true)
//         break
//       case `${moduleName}/tagList/sort`:
//         store.commit(`${moduleName}/setTagSorted`, true)
//         break
//     }
//   }
// })

export const register = () => store.registerModule(moduleName, multiStoreProductListStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
