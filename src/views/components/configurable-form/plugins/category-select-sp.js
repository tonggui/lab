import { SPU_FIELD } from '../field'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

/**
 * 后台类目组件 是否支持 最后一列 标品推荐的功能
 * 目前只有 药品标品审核 和 运营端审核详情 不支持此功能
 */
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
