import { SPU_FIELD } from '../field'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

export default () => ({
  name: '_CategorySelectSp_',
  config: [{
    key: SPU_FIELD.CATEGORY,
    options: {
      showProductList: true
    },
    events: {
      'on-select-product' (sp) {
        this.triggerEvent('selectSp', sp)
      }
    }
  }],
  mutations: {
    setSp ({ setData }, sp) {
      setData(sp)
    }
  },
  actions: {
    selectSp ({ commit }, sp) {
      if (!sp) {
        return
      }
      const data = convertStandardProduct(sp)
      commit('setSp', data)
    }
  }
})
