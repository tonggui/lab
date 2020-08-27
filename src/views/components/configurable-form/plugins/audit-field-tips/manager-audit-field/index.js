import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import categoryAttrContainer from './category-attr-container'
import { AUDIT_PRODUCT_SOURCE } from '@/data/enums/product'
import { categoryFormatterHOC } from '../formatter'

/**
 * 运营端 商家 纠错送审时，展示 纠错的字段信息
 * 此处涉及的字段 和 触发 商家纠错的字段应该联动起来，目前尚未联动
 * TODO 目前此处没有和触发 商家纠错的字段进行联动，可能需要整个配置，相互读取一下，进行同步联动
 * 当前 触发商家纠错的字段有
 * 【商品名称、商品类目、类目属性-关键属性】
 * 只有纠错送审的才会进行此逻辑
 */
export default () => ({
  name: '_ManagerAuditFieldTips_',
  context: {
    needShow: false,
    snapshot: {}
  },
  config: [{
    key: SPU_FIELD.NAME,
    options: {
      snapshot: undefined, // 审核快照信息（可能是商家纠错前的快照，不是很清楚～。～）
      showTip: false // 是否展示提示，其实就是是否是纠错，纠错才会展示tip
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
    // categoryFormatterHOC 格式化
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
    // 同步 needShow和snapshot
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { productSource, snapshot } = data
      commit('setNeedShow', productSource === AUDIT_PRODUCT_SOURCE.MERCHANT_CORRECTION)
      commit('setSnapshot', snapshot || {})
    },
    // 同步 needShow和snapshot
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
