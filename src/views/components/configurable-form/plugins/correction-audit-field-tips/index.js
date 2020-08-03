import { SPU_FIELD } from '../../field'
import { get } from 'lodash'
import CategoryAttrContainer from './category-attr-container'
import hoc from './with-correction-audit-tips'
import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

const categoryHOC = (WrapperComponent) => Vue.extend({
  props: ['separator'],
  methods: {
    formatter (category) {
      return ((category || {}).namePath || []).join(this.separator || '>')
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        formatter: this.formatter,
        separator: this.separator
      }
    })
  }
})

export default () => ({
  name: '_CorrectionAuditFieldTips_',
  context: {
    originalProduct: {},
    needCorrectionAudit: false
  },
  config: [{
    key: SPU_FIELD.UPC_CODE,
    container: hoc,
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
    container: hoc,
    options: {
      original: undefined
    },
    rules: [{
      result: {
        container () {
          return this.getContext('needCorrectionAudit') ? [hoc, categoryHOC] : undefined
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
