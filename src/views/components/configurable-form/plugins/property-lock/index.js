import { SPU_FELID } from '../../felid'
import { get } from 'lodash'
import Layout from './layout'
import CategoryAttrLockPropertyContainer from './category-attr-container'

export default () => ({
  name: '_PropertyLock_',
  context: {
    lockedProperty: []
  },
  config: [{
    key: SPU_FELID.NAME,
    rules: {
      result: {
        layout () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return lockedProperty.includes(SPU_FELID.NAME) ? Layout : null
        }
      }
    }
  }, {
    key: SPU_FELID.CATEGORY,
    rules: {
      result: {
        layout () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return lockedProperty.includes(SPU_FELID.CATEGORY) ? Layout : null
        }
      }
    }
  }, {
    key: SPU_FELID.CATEGORY_ATTRS,
    type: CategoryAttrLockPropertyContainer,
    rules: {
      result: {
        'options.locked' () {
          const lockedProperty = this.getContext('lockedProperty') || []
          return !!lockedProperty.includes(SPU_FELID.CATEGORY_ATTRS)
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
      const propertyLock = getRootContext('features').propertyLock
      let lockedProperty = []
      if (propertyLock && spId > 0) {
        lockedProperty = isSp ? [SPU_FELID.NAME, SPU_FELID.CATEGORY, SPU_FELID.CATEGORY_ATTRS] : [SPU_FELID.CATEGORY]
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
      if (get(newContext, 'features.propertyLock') !== get(oldContext, 'features.propertyLock')) {
        dispatch('getLockedProperty')
      }
    }
  }
})
