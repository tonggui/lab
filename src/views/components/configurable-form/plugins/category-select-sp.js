import { SPU_FELID } from '../felid'

export default () => ({
  name: '_CategorySelectSp_',
  config: [{
    key: SPU_FELID.CATEGORY,
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
      const { id, ...rest } = sp
      const data = {
        ...rest,
        spId: id
      }
      commit('setSp', data)
    }
  }
})
