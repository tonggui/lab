import { SPU_FIELD } from '../field'
import SpListModal from '@/views/components/sp-list/sp-list-modal'
import { get } from 'lodash'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

export default () => ({
  name: '_SelectFromProductLibrary_',
  context: {
    show: false,
    showCellularTopSale: false
  },
  config: [{
    key: SPU_FIELD.UPC_CODE,
    options: {
      supportProductLibrary: true
    },
    events: {
      showSpListModal () {
        this.triggerEvent('show')
      }
    }
  }, {
    key: SPU_FIELD.CATEGORY,
    options: {
      supportLocked: true
    },
    events: {
      showSpListModal () {
        this.triggerEvent('show')
      }
    }
  }, {
    type: SpListModal,
    layout: null,
    options: {
      showTopSale: false,
      value: false,
      userInput: ''
    },
    events: {
      'on-select-product' (sp) {
        this.triggerEvent('hide')
        this.triggerEvent('selectSp', sp)
      },
      'input' (value) {
        if (value) {
          this.triggerEvent('show')
        } else {
          this.triggerEvent('hide')
        }
      }
    },
    rules: {
      result: {
        'options.userInput' () {
          return this.getData('upcCode')
        },
        'options.showTopSale' () {
          return !!this.getContext('showCellularTopSale')
        },
        'options.value' () {
          return !!this.getContext('show')
        }
      }
    }
  }],
  mutations: {
    setSp ({ setData }, sp) {
      setData(sp)
    },
    setShow ({ setContext }, show) {
      setContext({ show: !!show })
    },
    setShowCellularTopSale ({ setContext }, showCellularTopSale) {
      setContext({ showCellularTopSale: !!showCellularTopSale })
    }
  },
  actions: {
    show ({ commit }) {
      commit('setShow', true)
    },
    hide ({ commit }) {
      commit('setShow', false)
    },
    selectSp ({ commit }, sp) {
      if (!sp) {
        return
      }
      const data = convertStandardProduct(sp)
      commit('setSp', data)
    }
  },
  hooks: {
    start ({ commit, getRootContext, getContext }) {
      const showCellularTopSale = getRootContext('features').showCellularTopSale
      if (showCellularTopSale !== getContext('showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
    },
    updateContext ({ commit }, newContext, oldContext) {
      const showCellularTopSale = get(newContext, 'features.showCellularTopSale')
      if (showCellularTopSale !== get(oldContext, 'features.showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
    }
  }
})
