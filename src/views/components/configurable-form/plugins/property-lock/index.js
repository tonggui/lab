import { SPU_FIELD } from '../../field'
import { get } from 'lodash'
import container from './container'
import CategoryAttrLockPropertyContainer from './category-attr-container'

/**
 * 字段锁定功能（白名单功能）
 * prd：https://km.sankuai.com/page/183433517
 * 字段锁定逻辑：创建的品有spId，就是是标品库的
 * 标品库标品：锁定【name，category】，类目属性 必填项 锁定
 * 标品库非标品：锁定【category】
 */
export default () => ({
  name: '_PropertyLock_',
  context: {
    lockedProperty: []
  },
  config: [{
    key: SPU_FIELD.NAME,
    rules: {
      result: {
        container () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return lockedProperty.includes(SPU_FIELD.NAME) ? container : null
        }
      }
    }
  }, {
    key: SPU_FIELD.CATEGORY,
    rules: {
      result: {
        container () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return lockedProperty.includes(SPU_FIELD.CATEGORY) ? container : null
        }
      }
    }
  }, {
    key: SPU_FIELD.CATEGORY_ATTRS,
    container: CategoryAttrLockPropertyContainer,
    rules: {
      result: {
        container () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return lockedProperty.includes(SPU_FIELD.CATEGORY_ATTRS) ? CategoryAttrLockPropertyContainer : null
        }
      }
    }
  }],
  mutations: {
    setLockedProperty ({ setContext }, lockedProperty) {
      setContext({ lockedProperty })
    }
  },
  actions: {
    // 根据场景，判断锁定的字段
    getLockedProperty ({ commit, getData, getRootContext }) {
      const isSp = getData('isSp') // 是否是标品库标品
      const spId = getData('spId') // 是否是标品库商品
      const propertyLock = getRootContext('features').propertyEditLock // 是否命中字段锁定控制
      let lockedProperty = []
      // 是标品库商品 && 命中字段锁定控制
      if (propertyLock && spId > 0) {
        // 锁定字段：标品库标品 => [名称，类目，类目属性必填]
        // 锁定字段：标品库非标品 => [类目]
        lockedProperty = isSp ? [SPU_FIELD.NAME, SPU_FIELD.CATEGORY, SPU_FIELD.CATEGORY_ATTRS] : [SPU_FIELD.CATEGORY]
      }
      // 设置锁定的字段
      commit('setLockedProperty', lockedProperty)
    }
  },
  hooks: {
    // 初始化，根据状态，进行字段锁定判断
    async start ({ dispatch }) {
      dispatch('getLockedProperty')
    },
    // spId,isSp变化，字段锁定属性 重新计算更新
    updateData ({ dispatch }, newData, oldData) {
      if (newData.spId !== oldData.spId || newData.isSp !== oldData.isSp) {
        dispatch('getLockedProperty')
      }
    },
    // 字段锁定开关变化，字段锁定属性 重新计算更新
    updateContext ({ dispatch }, newContext, oldContext) {
      if (get(newContext, 'features.propertyEditLock') !== get(oldContext, 'features.propertyEditLock')) {
        dispatch('getLockedProperty')
      }
    }
  }
})
