import { SPU_FIELD } from '../../../field'
import { get } from 'lodash'
import container from './container'
import categoryAttrContainer from './category-attr-container'
import { categoryFormatterHOC } from '../formatter'

/**
 * 初次进来，运营修改部分提示 展示如下：
 * ！审核人对所填信息有调整，如有误请修改并重新提交审核
 * 命中的字段和审核人可修改的字段相对应
 * TODO 目前此处没有和审核人可修改字段进行联动，可能需要整个配置，相互读取一下，进行同步联动
 * 当前 审核人可修改字段如下
 * 【商品名称、商品类目、类目属性】
 * 对比方式，通过提交审核的快照 approveSnapshot 和 初次获取的商品详情 originalProduct进行对比
 * 只有当 (approveSnapshot[字段a] !== originalProduct[字段a]) && (originalProduct[字段a] !== currentProduct[字段a])
 * 代表 审核人修改了信息 && 当前没有被用户修改，才会展示提示
 */
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
    // categoryFormatterHOC 格式化
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
    // 同步originalProduct,approveSnapshot
    async start ({ commit, getRootContext }) {
      const data = getRootContext('features').audit || {}
      const { originalProduct, approveSnapshot } = data
      commit('setOriginalProduct', originalProduct || {})
      commit('setApproveSnapshot', approveSnapshot || {})
    },
    // 同步originalProduct,approveSnapshot
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
