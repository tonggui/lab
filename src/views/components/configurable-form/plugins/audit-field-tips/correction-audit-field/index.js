import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import { categoryFormatterHOC } from '../formatter'
import categoryAttrContainer from './category-attr-container'

export default () => ({
  name: '_CorrectionAuditFieldTips_',
  context: {
    originalProduct: {},
    needCorrectionAudit: false
  },
  config: [{
    key: SPU_FIELD.UPC_CODE,
    options: {
      original: undefined,
      needCorrectionAudit: false
    },
    container,
    rules: [{
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.UPC_CODE)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY,
    options: {
      original: undefined
    },
    container: [container, categoryFormatterHOC],
    rules: [{
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.CATEGORY)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY_ATTRS,
    options: {
      original: undefined
    },
    container: categoryAttrContainer,
    rules: {
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.CATEGORY_ATTRS)
        }
      }
    }
  }],
  mutations: {
    setOriginalProduct ({ setContext }, originalProduct) {
      setContext({ originalProduct })
    },
    setNeedCorrectionAudit ({ setContext }, needCorrectionAudit) {
      setContext({ needCorrectionAudit: !!needCorrectionAudit })
    }
  },
  hooks: {
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { originalProduct, needCorrectionAudit } = data
      commit('setOriginalProduct', originalProduct || {})
      commit('setNeedCorrectionAudit', needCorrectionAudit)
    },
    updateContext ({ commit }, newContext, oldContext) {
      const { originalProduct, needCorrectionAudit } = newContext.features.audit || {}
      if (originalProduct !== get(oldContext, 'features.audit.originalProduct')) {
        commit('setOriginalProduct', originalProduct || {})
      }
      if (needCorrectionAudit !== get(oldContext, 'features.audit.needCorrectionAudit')) {
        commit('setNeedCorrectionAudit', needCorrectionAudit)
      }
    }
  }
})
