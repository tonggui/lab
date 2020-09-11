import { SPU_FIELD } from '../field'
import SpListModal from '@/views/components/sp-list/sp-list-modal'
import { get } from 'lodash'
import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

/**
 * 从标品库选择商品弹框
 */
export default () => ({
  name: '_SelectFromProductLibrary_',
  context: {
    show: false,
    showCellularTopSale: false
  },
  config: [{
    // upc 输入，支持从标品库选择
    key: SPU_FIELD.UPC_CODE,
    options: {
      supportProductLibrary: true
    },
    events: {
      // 展示 弹框
      showSpListModal () {
        this.triggerEvent('show')
      }
    }
  }, {
    // 后台类目锁定的时候，引导从商品库选择商品
    key: SPU_FIELD.CATEGORY,
    options: {
      supportLocked: true
    },
    events: {
      // 展示 弹框
      showSpListModal () {
        this.triggerEvent('show')
      }
    }
  }, {
    // 从商品库选择商品弹框
    type: SpListModal,
    layout: null,
    options: {
      // 是否支持区域热卖 tab，此tab 只支持单店，多店场景下不支持此功能，配置在context中
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
    // 选择标品
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
    // 同步 showCellularTopSale
    start ({ commit, getRootContext, getContext }) {
      const showCellularTopSale = getRootContext('features').showCellularTopSale
      if (showCellularTopSale !== getContext('showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
    },
    // 同步 showCellularTopSale
    updateContext ({ commit }, newContext, oldContext) {
      const showCellularTopSale = get(newContext, 'features.showCellularTopSale')
      if (showCellularTopSale !== get(oldContext, 'features.showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
    }
  }
})
