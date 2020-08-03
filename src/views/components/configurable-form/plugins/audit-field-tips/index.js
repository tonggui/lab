import { SPU_FIELD } from '../../field'
import { get } from 'lodash'
import CategoryAttrContainer from './category-attr-container'
import hoc from './with-audit-tips'

export default () => ({
  name: '_AuditFieldTips_',
  context: {
    originalProduct: {},
    approveSnapshot: {}
  },
  config: [{
    key: SPU_FIELD.NAME,
    container: hoc,
    options: {
      original: undefined,
      approve: undefined
    },
    rules: [{
      result: {
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.NAME)
        },
        'options.approve' () {
          const approveSnapshot = this.getContext('approveSnapshot')
          return get(approveSnapshot, SPU_FIELD.NAME)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY,
    container: hoc,
    options: {
      original: undefined,
      approve: undefined
    },
    rules: [{
      result: {
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.CATEGORY)
        },
        'options.approve' () {
          const approveSnapshot = this.getContext('approveSnapshot')
          return get(approveSnapshot, SPU_FIELD.CATEGORY)
        }
      }
    }]
  }, {
    key: SPU_FIELD.CATEGORY_ATTRS,
    container: CategoryAttrContainer,
    options: {
      original: undefined,
      approve: undefined
    },
    rules: {
      result: {
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, 'categoryAttrValueMap')
        },
        'options.approve' () {
          const approveSnapshot = this.getContext('approveSnapshot')
          return get(approveSnapshot, 'normalAttributesValueMap')
        }
      }
    }
  }],
  mutations: {
    setOriginalProduct ({ setContext }, originalProduct) {
      setContext({ originalProduct })
    },
    setApproveSnapshot ({ setContext }, approveSnapshot) {
      setContext({ approveSnapshot })
    }
  },
  hooks: {
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { originalProduct, approveSnapshot } = data
      console.log('start:', originalProduct, approveSnapshot)
      commit('setOriginalProduct', originalProduct || {})
      commit('setApproveSnapshot', approveSnapshot || {})
    },
    updateContext ({ commit }, newContext, oldContext) {
      const { originalProduct, approveSnapshot } = newContext.features.audit || {}
      if (originalProduct !== get(oldContext, 'features.audit.originalProduct')) {
        commit('setOriginalProduct', originalProduct || {})
      }
      if (approveSnapshot !== get(oldContext, 'features.audit.approveSnapshot')) {
        commit('setApproveSnapshot', approveSnapshot || {})
      }
    }
  }
})
