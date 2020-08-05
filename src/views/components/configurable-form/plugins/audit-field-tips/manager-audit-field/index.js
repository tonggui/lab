import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import categoryAttrContainer from './category-attr-container'
import { AUDIT_PRODUCT_SOURCE } from '@/data/enums/product'
import { categoryFormatterHOC } from '../formatter'

export default () => ({
  name: '_ManagerAuditFieldTips_',
  context: {
    needShow: false,
    snapshot: {}
  },
  config: [{
    key: SPU_FIELD.NAME,
    options: {
      snapshot: undefined,
      showTip: false
    },
    container: container,
    rules: [{
      result: {
        'options.showTip' () {
          return !!this.getContext('needShow')
        },
        'options.snapshot' () {
          const snapshot = this.getContext('snapshot')
          return get(snapshot, SPU_FIELD.NAME)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY,
    options: {
      snapshot: undefined,
      showTip: false
    },
    container: [container, categoryFormatterHOC],
    rules: [{
      result: {
        'options.showTip' () {
          return !!this.getContext('needShow')
        },
        'options.snapshot' () {
          const snapshot = this.getContext('snapshot')
          return get(snapshot, SPU_FIELD.CATEGORY)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY_ATTRS,
    container: categoryAttrContainer,
    options: {
      snapshot: undefined,
      showTip: false
    },
    rules: {
      result: {
        'options.showTip' () {
          return !!this.getContext('needShow')
        },
        'options.snapshot' () {
          const snapshot = this.getContext('snapshot')
          return get(snapshot, SPU_FIELD.CATEGORY_ATTRS)
        }
      }
    }
  }],
  mutations: {
    setNeedShow ({ setContext }, needShow) {
      setContext({ needShow })
    },
    setSnapshot ({ setContext }, snapshot) {
      setContext({ snapshot })
    }
  },
  hooks: {
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { productSource, snapshot } = data
      commit('setNeedShow', productSource === AUDIT_PRODUCT_SOURCE.MERCHANT_CORRECTION)
      commit('setSnapshot', snapshot || {})
    },
    updateContext ({ commit }, newContext, oldContext) {
      const { productSource, snapshot } = newContext.features.audit || {}
      if (productSource !== get(oldContext, 'features.audit.productSource')) {
        commit('setNeedShow', productSource === AUDIT_PRODUCT_SOURCE.MERCHANT_CORRECTION)
      }
      if (snapshot !== get(oldContext, 'features.audit.snapshot')) {
        commit('setSnapshot', snapshot || {})
      }
    }
  }
})
