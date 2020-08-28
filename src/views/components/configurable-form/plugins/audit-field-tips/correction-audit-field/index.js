import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import { categoryFormatterHOC } from '../formatter'
import categoryAttrContainer from './category-attr-container'

/**
 * 商家端 商家触发 纠错送审时的提示
 * 此处涉及的字段 和 运营端看到的纠错字段信息其实是一致的，但是目前没有联动，有机会搞成联动的吧，省事
 * TODO 目前此处没有和运营端 商家 纠错送审的字段进行联动，可能需要整个配置，相互读取一下，进行同步联动
 * 当前 触发商家纠错的字段有
 * 【商品名称、商品类目、类目属性-关键属性】
 * 只有纠错送审的才会进行此逻辑
 *
 * 对比逻辑是：进入页面获取的detail信息和当前用户修改的信息实时对比！！！
 */
export default () => ({
  name: '_CorrectionAuditFieldTips_',
  context: {
    originalProduct: {}, // 进入页面获取的detail信息
    needCorrectionAudit: false // 是否触发纠错送审
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
    // 同步 needCorrectionAudit和originalProduct
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { originalProduct, needCorrectionAudit } = data
      commit('setOriginalProduct', originalProduct || {})
      commit('setNeedCorrectionAudit', needCorrectionAudit)
    },
    // 同步 needCorrectionAudit和originalProduct
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
