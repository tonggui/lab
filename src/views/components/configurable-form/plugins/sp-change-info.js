import SpChangeInfo from '@/views/components/configurable-form/components/sp-change-info'
import { get } from 'lodash'
import { SP_CHANGE_FIELD } from '@/data/enums/fields'
import { ATTR_TYPE } from '@/data/enums/category'
import lx from '@/common/lx/lxReport'

export default ({ getChangeInfo }) => ({
  name: '_SpChangeInfo_',
  context: {
    basicInfoList: [],
    categoryAttrInfoList: [],
    show: false,
    allowErrorRecovery: false,
    spChangeInfoDecision: undefined
  },
  config: [{
    type: SpChangeInfo,
    options: {
      product: {},
      basicInfoList: [],
      categoryAttrInfoList: [],
      value: false,
      categoryAttrList: [],
      hasStep: false
    },
    rules: {
      result: {
        'options.product' () {
          return {
            id: this.getData('id'),
            skuList: this.getData('skuList')
          }
        },
        'options.categoryAttrList' () {
          const normalAttributes = this.getData('normalAttributes') || []
          const sellAttributes = this.getData('sellAttributes') || []
          return [...normalAttributes, ...sellAttributes]
        },
        'options.categoryAttrInfoList' () {
          return this.getContext('categoryAttrInfoList')
        },
        'options.basicInfoList' () {
          return this.getContext('basicInfoList')
        },
        'options.value' () {
          return this.getContext('show')
        },
        'options.hasStep' () {
          return !!this.getContext('allowErrorRecovery')
        }
      }
    },
    events: {
      confirm (type, basicInfoList = [], categoryAttrInfoList = []) {
        this.triggerEvent('confirm', type, basicInfoList, categoryAttrInfoList)
      },
      correct () {
        this.triggerEvent('correct')
      },
      cancel () {
        this.triggerEvent('cancel')
      }
    }
  }],
  mutations: {
    setAllowErrorRecovery ({ setContext }, allowErrorRecovery) {
      setContext({ allowErrorRecovery: !!allowErrorRecovery })
    },
    setShow ({ setContext }, show) {
      setContext({ show: !!show })
    },
    setBasicInfoList ({ setContext }, basicInfoList) {
      setContext({ basicInfoList })
    },
    setCategoryAttrInfoList ({ setContext }, categoryAttrInfoList) {
      setContext({ categoryAttrInfoList })
    },
    setProduct ({ setData }, product) {
      setData(product)
    },
    setSpChangeInfoDecision ({ setContext, getData }, type) {
      const id = getData('id')
      lx.mc({ bid: 'b_shangou_online_e_igr1pn6t_mc', val: { op_type: type, spu_id: id || 0 } })
      setContext({ spChangeInfoDecision: type })
    }
  },
  actions: {
    hide ({ commit }) {
      commit('setShow', false)
    },
    correct ({ commit, dispatch }) {
      commit('setSpChangeInfoDecision', 4)
      dispatch('hide')
    },
    cancel ({ commit, dispatch }) {
      commit('setSpChangeInfoDecision', 3)
      dispatch('hide')
    },
    confirm ({ commit, dispatch, getData }, type, basicInfoList = [], categoryAttrInfoList = []) {
      commit('setSpChangeInfoDecision', type)
      const updateProduct = {}
      const skuList = [...getData('skuList')]
      const categoryAttrValueMap = { ...getData('categoryAttrValueMap') }
      const updateSku = { ...skuList[0] }
      basicInfoList.forEach(basicInfo => {
        const key = basicInfo.field
        const newValue = basicInfo.newValue
        switch (key) {
          case SP_CHANGE_FIELD.PICTURE_LIST:
            if (type === 1) {
              updateProduct.pictureList = newValue
              updateProduct.poorPictureList = []
            }
            break
          case SP_CHANGE_FIELD.WEIGHT:
            updateSku.weight.value = newValue
            break
          case SP_CHANGE_FIELD.SUGGESTED_PRICE:
            updateSku.suggestedPrice = newValue
            break
          case SP_CHANGE_FIELD.SPEC_NAME:
            updateSku.specName = newValue
            break
          case SP_CHANGE_FIELD.UPC_CODE:
            updateSku.upcCode = newValue
            break
          case SP_CHANGE_FIELD.NAME:
            updateProduct.name = newValue
        }
      })
      categoryAttrInfoList.forEach(categoryAttr => {
        categoryAttrValueMap[categoryAttr.field] = categoryAttr.newValue
      })
      skuList.splice(0, 1, updateSku)
      const newProduct = { ...updateProduct, skuList, categoryAttrValueMap }
      commit('setProduct', newProduct)
      dispatch('hide')
    }
  },
  hooks: {
    async start ({ commit, getData, getRootContext }) {
      const id = getData('id')
      if (!id) {
        return
      }
      let { basicInfoList, categoryAttrInfoList } = await getChangeInfo(id)
      const allowErrorRecovery = getRootContext('features').allowErrorRecovery
      const hasSellAttr = (getData('categoryAttrList') || []).some(v => v.attrType === ATTR_TYPE.SELL)
      // 如果有销售属性，则过滤掉规格
      if (hasSellAttr) {
        basicInfoList = basicInfoList.filter(basicInfo => {
          return basicInfo.field !== SP_CHANGE_FIELD.SPEC_NAME
        })
      }
      if (basicInfoList.length > 0 || categoryAttrInfoList.length > 0) {
        commit('setAllowErrorRecovery', allowErrorRecovery)
        commit('setBasicInfoList', basicInfoList)
        commit('setCategoryAttrInfoList', categoryAttrInfoList)
        commit('setShow', true)
      }
    },
    updateContext ({ commit }, newContext, oldContext) {
      const allowErrorRecovery = get(newContext, 'features.allowErrorRecovery')
      if (allowErrorRecovery !== get(oldContext, 'features.allowErrorRecovery')) {
        commit('setAllowErrorRecovery', allowErrorRecovery)
      }
    }
  }
})
