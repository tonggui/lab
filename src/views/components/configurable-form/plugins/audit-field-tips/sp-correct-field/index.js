import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import imgContainer from './imgContainer'
import { categoryFormatterHOC, BasicFormatterHOC } from '../formatter'
import categoryAttrContainer from './category-attr-container'
import sellInfoContainer from './sell-info-container'

/**
 * 商家端 医药标品纠错事的提示
 * 当前 触发商家纠错diff的字段有
 * 【商品名称、商品类目、商品图片、售卖规格、类目属性（除温馨提示）】
 * 对比逻辑是：进入页面获取的detail信息和当前用户修改的信息实时对比！！！
 */
export default () => ({
  name: '_CorrectionAuditFieldTips_',
  context: {
    originalProduct: {}, // 进入页面获取的detail信息
    needCorrectionAudit: false, // 是否触发纠错diff
    categoryFieldConfig: []
  },
  config: [{
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
    key: SPU_FIELD.NAME,
    options: {
      original: undefined
    },
    container: [container, BasicFormatterHOC],
    rules: [{
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.NAME)
        }
      }
    }]
  }, {
    key: SPU_FIELD.PICTURE_LIST,
    options: {
      original: undefined
    },
    container: [imgContainer, BasicFormatterHOC],
    rules: [{
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.PICTURE_LIST)
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
        },
        'options.categoryFieldConfig' () {
          return this.getContext('categoryFieldConfig')
        }
      }
    }
  }, {
    key: SPU_FIELD.SKU_LIST,
    options: {
      original: undefined
    },
    container: sellInfoContainer,
    rules: [{
      result: {
        'options.needCorrectionAudit' () {
          return !!this.getContext('needCorrectionAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.SKU_LIST)
        }
      }
    }]
  }],
  mutations: {
    setOriginalProduct ({ setContext }, originalProduct) {
      setContext({ originalProduct })
    },
    setNeedCorrectionAudit ({ setContext }, needCorrectionAudit) {
      setContext({ needCorrectionAudit: !!needCorrectionAudit })
    },
    setCategoryFieldConfig ({ setContext }, categoryFieldConfig) {
      setContext({ categoryFieldConfig })
    }
  },
  hooks: {
    // 同步 needCorrectionAudit和originalProduct
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const categoryFieldConfig = getRootContext('categoryFieldConfig')
      const { originalProduct, needCorrectionAudit } = data
      commit('setOriginalProduct', originalProduct || {})
      commit('setNeedCorrectionAudit', needCorrectionAudit)
      commit('setCategoryFieldConfig', categoryFieldConfig)
    },
    // 同步 needCorrectionAudit和originalProduct
    updateContext ({ commit }, newContext, oldContext) {
      const { originalProduct, needCorrectionAudit } = newContext.features.audit || {}
      const categoryFieldConfig = newContext.categoryFieldConfig || []
      if (originalProduct !== get(oldContext, 'features.audit.originalProduct')) {
        commit('setOriginalProduct', originalProduct || {})
      }
      if (needCorrectionAudit !== get(oldContext, 'features.audit.needCorrectionAudit')) {
        commit('setNeedCorrectionAudit', needCorrectionAudit)
      }
      if (categoryFieldConfig !== get(oldContext, 'categoryFieldConfig')) {
        commit('setCategoryFieldConfig', categoryFieldConfig)
      }
    }
  }
})
