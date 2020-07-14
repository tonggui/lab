import { SPU_FELID } from '../felid'
import { Store } from 'vuex'

const name = '_CategorySelectSp_'

let store = null

export default {
  name,
  config: [{
    key: SPU_FELID.CATEGORY,
    options: {
      showProductList: true,
      supportLocked: true
    },
    events: {
      'on-select-product' (sp) {
        store.dispatch('selectSp', sp)
      }
    }
  }],
  store: () => {
    store = new Store({
      actions: {
        selectSp ({ dispatch }, sp) {
          dispatch('selectSp', sp, { root: true })
        }
      }
    })
    return store
  }
}
