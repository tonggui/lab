import SpChangeInfo from '@/views/components/configurable-form/components/sp-change-info'
import { get } from 'lodash'
import { SP_CHANGE_FIELD } from '@/data/enums/fields'
import lx from '@/common/lx/lxReport'

/**
 * 标品更新弹框 逻辑
 */
export default ({ getChangeInfo }) => ({
  name: '_SpChangeInfo_',
  context: {
    basicInfoList: [], // 基本信息变化对比
    categoryAttrInfoList: [], // 类目属性信息变化对比
    show: false, // 是否展示弹框
    allowErrorRecovery: false, // 是否支持纠错
    spChangeInfoDecision: undefined // 更新类型，用于埋点
  },
  config: [{
    type: SpChangeInfo, // 标品更新弹框组件
    // 参考组件 src/views/components/configurable-form/components/sp-change-info
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
      // 确认更新
      confirm (type, basicInfoList = [], categoryAttrInfoList = []) {
        this.triggerEvent('confirm', type, basicInfoList, categoryAttrInfoList)
      },
      // 纠错
      correct () {
        this.triggerEvent('correct')
      },
      // 取消
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
    // 关闭弹框
    hide ({ commit }) {
      commit('setShow', false)
    },
    // 纠错
    correct ({ commit, dispatch }) {
      commit('setSpChangeInfoDecision', 4)
      dispatch('hide')
    },
    // 取消
    cancel ({ commit, dispatch }) {
      commit('setSpChangeInfoDecision', 3)
      dispatch('hide')
    },
    // 确认更新
    confirm ({ commit, dispatch, getData }, type, basicInfoList = [], categoryAttrInfoList = []) {
      commit('setSpChangeInfoDecision', type)
      const updateProduct = {}
      const skuList = [...getData('skuList')]
      const normalAttributesValueMap = { ...getData('normalAttributesValueMap') }
      const updateSku = { ...skuList[0] }
      /**
       * TODO 可以考虑优化，基本信息，更新逻辑
       */
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
        normalAttributesValueMap[categoryAttr.field] = categoryAttr.newValue
      })
      skuList.splice(0, 1, updateSku)
      const newProduct = { ...updateProduct, skuList, normalAttributesValueMap }
      // 更新商品信息
      commit('setProduct', newProduct)
      dispatch('hide')
    }
  },
  hooks: {
    // 初始化完成之后，获取更新信息
    async start ({ commit, getData, getRootContext }) {
      const id = getData('id')
      if (!id) {
        return
      }
      let { basicInfoList, categoryAttrInfoList } = await getChangeInfo(id)
      const allowErrorRecovery = getRootContext('features').allowErrorRecovery
      const hasSellAttr = (getData('sellAttributes') || []).length > 0
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
    // allowErrorRecovery 同步
    updateContext ({ commit }, newContext, oldContext) {
      const allowErrorRecovery = get(newContext, 'features.allowErrorRecovery')
      if (allowErrorRecovery !== get(oldContext, 'features.allowErrorRecovery')) {
        commit('setAllowErrorRecovery', allowErrorRecovery)
      }
    }
  }
})
