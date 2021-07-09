
import store from '@/store'
import { createNamespacedHelpers } from 'vuex'
import merchantProductListStore from './store'

const moduleName = 'merchantProductList'

store.subscribeAction({
  after: (action, _state) => {
    switch (action.type) {
      case `${moduleName}/tagList/select`:
        store.dispatch(`${moduleName}/changeProductTagId`, action.payload.id)
        break
      case `${moduleName}/product/delete`:
        store.dispatch(`${moduleName}/productDelete`)
        break
      case `${moduleName}/product/sort`:
        store.commit(`${moduleName}/setProductSorted`, true)
        break
      case `${moduleName}/tagList/sort`:
        store.commit(`${moduleName}/setTagSorted`, true)
        break
      case `${moduleName}/product/batch`:
        store.dispatch(`${moduleName}/productDelete`)
        break
    }
  }
})

export const register = () => store.registerModule(moduleName, merchantProductListStore)

export const remove = () => store.unregisterModule(moduleName)

export const helper = (module = '') => createNamespacedHelpers(module ? `${moduleName}/${module}` : moduleName)
