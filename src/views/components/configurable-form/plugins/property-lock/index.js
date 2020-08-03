import { SPU_FIELD } from '../../field'
import { get } from 'lodash'
import container from './container'
import CategoryAttrLockPropertyContainer from './category-attr-container'

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
    getLockedProperty ({ commit, getData, getRootContext }) {
      const isSp = getData('isSp')
      const spId = getData('spId')
      const propertyLock = getRootContext('features').propertyEditLock
      let lockedProperty = []
      if (propertyLock && spId > 0) {
        lockedProperty = isSp ? [SPU_FIELD.NAME, SPU_FIELD.CATEGORY, SPU_FIELD.CATEGORY_ATTRS] : [SPU_FIELD.CATEGORY]
      }
      commit('setLockedProperty', lockedProperty)
    }
  },
  hooks: {
    async start ({ dispatch }) {
      dispatch('getLockedProperty')
    },
    updateData ({ dispatch }, newData, oldData) {
      if (newData.spId !== oldData.spId || newData.isSp !== oldData.isSp) {
        dispatch('getLockedProperty')
      }
    },
    updateContext ({ dispatch }, newContext, oldContext) {
      if (get(newContext, 'features.propertyEditLock') !== get(oldContext, 'features.propertyEditLock')) {
        dispatch('getLockedProperty')
      }
    }
  }
})
