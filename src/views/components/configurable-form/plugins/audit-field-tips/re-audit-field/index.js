import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import categoryAttrContainer from './category-attr-container'
import { categoryFormatterHOC } from '../formatter'

export default () => ({
  name: '_AuditFieldTips_',
  context: {
    originalProduct: {},
    approveSnapshot: {}
  },
  config: [{
    key: SPU_FIELD.NAME,
    container: container,
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
    container: [container, categoryFormatterHOC],
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
    container: categoryAttrContainer,
    options: {
      original: undefined,
      approve: undefined
    },
    rules: {
      result: {
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.CATEGORY_ATTRS)
        },
        'options.approve' () {
          const approveSnapshot = this.getContext('approveSnapshot')
          return get(approveSnapshot, SPU_FIELD.CATEGORY_ATTRS)
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
