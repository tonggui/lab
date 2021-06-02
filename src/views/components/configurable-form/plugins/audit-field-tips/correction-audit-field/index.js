import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import needAuditTipContainer from './need-adudit-tip-container'
import { categoryFormatterHOC } from '../formatter'
import categoryAttrContainer from './category-attr-container'
import sellInfoContainer from './sell-info-container'

const getNeedAuditTipConfig = () => Object.values(SPU_FIELD).map(val => ({
  key: val,
  options: {
    original: undefined
  },
  container: needAuditTipContainer,
  rules: [{
    result: {
      'options.needCorrectionAudit' () {
        return !!this.getContext('needCorrectionAudit')
      },
      'options.original' () {
        const originalProduct = this.getContext('originalProduct')
        return get(originalProduct, val)
      },
      'options.visible' () {
        return !!this.getContext('needAuditList').includes(val) && this.getContext('complianceNeedAuditTip')
      }
    }
  }]
}))

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
    needCorrectionAudit: false, // 是否触发纠错送审
    businessNeedAudit: false, // 业务审核需要审核提示
    complianceNeedAuditTip: false, // 合规审核需要审核提示
    needAuditList: [] // 控制展示提示的字段
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
        },
        'options.businessNeedAudit' () {
          return !!this.getContext('businessNeedAudit')
        },
        'options.complianceNeedAuditTip' () {
          return !!this.getContext('complianceNeedAuditTip')
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
          return (!!this.getContext('needCorrectionAudit') && !!this.getContext('businessNeedAudit')) || !!this.getContext('complianceNeedAuditTip')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.CATEGORY_ATTRS)
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
          return !!this.getContext('needCorrectionAudit') && !!this.getContext('businessNeedAudit')
        },
        'options.original' () {
          const originalProduct = this.getContext('originalProduct')
          return get(originalProduct, SPU_FIELD.SKU_LIST)
        },
        'options.complianceNeedAuditTip' () {
          return !!this.getContext('complianceNeedAuditTip')
        },
        'options.needAuditList' () {
          return this.getContext('needAuditList')
        }
      }
    }]
  }].concat(getNeedAuditTipConfig()),
  mutations: {
    setOriginalProduct ({ setContext }, originalProduct) {
      setContext({ originalProduct })
    },
    setNeedCorrectionAudit ({ setContext }, needCorrectionAudit) {
      setContext({ needCorrectionAudit: !!needCorrectionAudit })
    },
    setBusinessNeedAudit ({ setContext }, businessNeedAudit) {
      setContext({ businessNeedAudit: !!businessNeedAudit })
    },
    setComplianceNeedAuditTip ({ setContext }, complianceNeedAuditTip) {
      setContext({ complianceNeedAuditTip: !!complianceNeedAuditTip })
    },
    setNeedAuditList ({ setContext }, needAuditList) {
      setContext({ needAuditList: needAuditList })
    }
  },
  hooks: {
    // 同步 needCorrectionAudit和originalProduct
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { originalProduct, needCorrectionAudit, businessNeedAudit, complianceNeedAuditTip, needAuditList } = data
      commit('setOriginalProduct', originalProduct || {})
      commit('setNeedCorrectionAudit', needCorrectionAudit)
      commit('setBusinessNeedAudit', businessNeedAudit)
      commit('setComplianceNeedAuditTip', complianceNeedAuditTip)
      commit('setNeedAuditList', needAuditList)
    },
    // 同步 needCorrectionAudit和originalProduct
    updateContext ({ commit }, newContext, oldContext) {
      const { originalProduct, needCorrectionAudit, businessNeedAudit, complianceNeedAuditTip } = newContext.features.audit || {}
      if (originalProduct !== get(oldContext, 'features.audit.originalProduct')) {
        commit('setOriginalProduct', originalProduct || {})
      }
      if (needCorrectionAudit !== get(oldContext, 'features.audit.needCorrectionAudit')) {
        commit('setNeedCorrectionAudit', needCorrectionAudit)
      }
      if (businessNeedAudit !== get(oldContext, 'features.audit.businessNeedAudit')) {
        commit('setBusinessNeedAudit', businessNeedAudit || {})
      }
      if (complianceNeedAuditTip !== get(oldContext, 'features.audit.complianceNeedAuditTip')) {
        commit('setComplianceNeedAuditTip', complianceNeedAuditTip)
      }
    }
  }
})
