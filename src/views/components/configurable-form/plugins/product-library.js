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
    showCellularTopSale: false,
    supportCategoryLocked: true,
    // 查询的信息
    keyword: ''
  },
  config: [{
    // upc 输入，支持从标品库选择
    key: SPU_FIELD.UPC_CODE,
    options: {
      supportProductLibrary: true
    },
    events: {
      // 展示 弹框
      showSpListModal (val) {
        this.triggerEvent('show', val)
      }
    },
    rules: {
      result: {
        value () {
          return ''
        }
      }
    }
  }, {
    // 后台类目锁定的时候，引导从商品库选择商品
    key: SPU_FIELD.CATEGORY,
    events: {
      // 展示 弹框
      showSpListModal () {
        this.triggerEvent('show')
      }
    },
    rules: {
      result: {
        'options.supportLocked' () {
          return !!this.getContext('supportCategoryLocked')
        }
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
      userInput: '',
      defaultSelectedTab: 'all',
      outsideMode: true
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
          return this.getContext('keyword')
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
    setKeyword ({ setContext }, keyword) {
      setContext({ keyword })
    },
    setShowCellularTopSale ({ setContext }, showCellularTopSale) {
      setContext({ showCellularTopSale: !!showCellularTopSale })
    },
    setSupportCategoryLocked ({ setContext }, supportCategoryLocked) {
      setContext({ supportCategoryLocked: !!supportCategoryLocked })
    }
  },
  actions: {
    show ({ commit }, keyword = '') {
      commit('setShow', true)
      commit('setKeyword', keyword)
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
      const supportCategoryLocked = getRootContext('features').supportCategoryLocked
      if (showCellularTopSale !== getContext('showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
      // 只要不为undefined，则同步数据状态
      if (supportCategoryLocked !== undefined && supportCategoryLocked !== getContext('supportCategoryLocked')) {
        commit('setSupportCategoryLocked', supportCategoryLocked)
      }
    },
    // 同步 showCellularTopSale
    updateContext ({ commit }, newContext, oldContext) {
      const showCellularTopSale = get(newContext, 'features.showCellularTopSale')
      if (showCellularTopSale !== get(oldContext, 'features.showCellularTopSale')) {
        commit('setShowCellularTopSale', showCellularTopSale)
      }
      const supportCategoryLocked = get(newContext, 'features.supportCategoryLocked')
      if (supportCategoryLocked !== get(oldContext, 'features.supportCategoryLocked')) {
        commit('setSupportCategoryLocked', supportCategoryLocked)
      }
    }
  }
})
