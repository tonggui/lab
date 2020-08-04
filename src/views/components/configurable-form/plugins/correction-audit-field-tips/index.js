import { SPU_FIELD } from '../../field'
import { get } from 'lodash'
import CategoryAttrContainer from './category-attr-container'
import hoc from './with-correction-audit-tips'
import { categoryFormatterHOC } from './formatter'

export default () => ({
  name: '_CorrectionAuditFieldTips_',
  context: {
    originalProduct: {},
    needCorrectionAudit: false
  },
  config: [{
    key: SPU_FIELD.UPC_CODE,
    options: {
      original: undefined
    },
    rules: [{
      result: {
        container () {
          return this.getContext('needCorrectionAudit') ? hoc : undefined
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
    rules: [{
      result: {
        container () {
          return this.getContext('needCorrectionAudit') ? [hoc, categoryFormatterHOC] : undefined
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
    rules: {
      result: {
        container () {
          return this.getContext('needCorrectionAudit') ? CategoryAttrContainer : undefined
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, 'categoryAttrValueMap')
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
