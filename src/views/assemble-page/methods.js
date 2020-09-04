import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import Vue from 'vue'
import lx from '@/common/lx/lxReport'
import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'

function dd (services) {
  const {
    fetchProductDetail, fetchSpInfoById, fetchNeedAudit, fetchSubmitProduct, fetchRevocationProduct
  } = services
  const data = Vue.observable({
    product: {},
    originalFormData: {},
    poiNeedAudit: false,
    supportAudit: true,
    categoryNeedAudit: false,
    originalProductCategoryNeedAudit: false
  })

  const methods = {
    fetchSubmitEditProduct: async function fetchSubmitEditProduct (context) {
      const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, editType = undefined, showLimitSale, _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 } } = context
      const { ignoreId = null, suggest = { id: '' } } = _SuggestCategory_ || {
        ignoreId: null,
        suggest: { id: '' }
      }
      const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = data.product
      const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
      // op_type 标品更新纠错处理，0表示没有弹窗
      lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
      const res = await fetchSubmitProduct({ ...rest, categoryAttrList, categoryAttrValueMap }, {
        editType,
        entranceType: this.$route.query.entranceType,
        dataSource: this.$route.query.dataSource,
        ignoreSuggestCategory: !!ignoreId,
        suggestCategoryId: suggest.id,
        validType: validType,
        needAudit: needAudit,
        isNeedCorrectionAudit: isNeedCorrectionAudit,
        showLimitSale
      }, poiId)
      return !!res
    },

    fetchUpcIsSp: async function fetchUpcIsSp (upc) {
      return !!upc
    },

    getGetNeedAudit: async function getGetNeedAudit (changeOrigin = false) {
      const { category = { id: '' } } = data.product
      // 获取商品是否满足需要送审条件
      if (category && category.id) {
        let { poiNeedAudits, categoryNeedAudits } = await fetchNeedAudit(category.id)
        data.poiNeedAudit = poiNeedAudits
        data.categoryNeedAudit = categoryNeedAudits
        if (changeOrigin) data.originalProductCategoryNeedAudit = categoryNeedAudits
      }
    },

    fetchRevocation: async function fetchRevocation () {
      return !!await fetchRevocationProduct(data.product)
    },

    handleRevocation: async function handleRevocation (products, cb) {
      try {
        data.product = products
        await methods.fetchRevocation()
        cb()
      } catch (err) {
        cb(err)
      }
    },

    getDetail: async function getDetail () {
      try {
        const { categoryAttrList, categoryAttrValueMap, ...rest } = await fetchProductDetail(this.spuId, poiId)
        const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
        data.product = { ...rest, ...categoryAttr }
        data.originalFormData = cloneDeep(data.product) // 对之前数据进行拷贝
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      }
    },

    getSpDetail: async function getSpDetail () {
      try {
        const spDetail = await fetchSpInfoById(+this.spId)
        const { id, ...rest } = spDetail
        // TODO 和之前逻辑?
        data.product = Object.assign({}, rest, { spId: +this.spId, id: undefined })
        data.originalFormData = cloneDeep(data.product) // 对之前数据进行拷贝
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      }
    },

    handleSubmit: async function handleSubmit (products, context, cb) {
      try {
        data.product = products
        const response = await methods.fetchSubmitEditProduct(context)
        cb(response)
      } catch (err) {
        cb(null, err)
      }
    },

    handleCategoryChange: function handleCategoryChange (products) {
      data.product = products
    },

    handleCancel: function handleCancel () {
      this.$tryToNext()
    }
  }
  return {
    data,
    methods
  }
}

console.log('dd', dd)

export default {
  fetchSubmitEditProduct: async function fetchSubmitEditProduct (context) {
    const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, editType = undefined, showLimitSale, _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 } } = context
    const { ignoreId = null, suggest = { id: '' } } = _SuggestCategory_ || {
      ignoreId: null,
      suggest: { id: '' }
    }
    const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.data.product
    const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
    // op_type 标品更新纠错处理，0表示没有弹窗
    lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
    const res = await this.services.fetchSubmitProduct({ ...rest, categoryAttrList, categoryAttrValueMap }, {
      editType,
      entranceType: this.$route.query.entranceType,
      dataSource: this.$route.query.dataSource,
      ignoreSuggestCategory: !!ignoreId,
      suggestCategoryId: suggest.id,
      validType: validType,
      needAudit: needAudit,
      isNeedCorrectionAudit: isNeedCorrectionAudit,
      showLimitSale
    }, poiId)
    return !!res
  },

  fetchUpcIsSp: async function fetchUpcIsSp (upc) {
    return !!upc
  },

  getGetNeedAudit: async function getGetNeedAudit (changeOrigin = false) {
    const { category = { id: '' } } = this.data.product
    // 获取商品是否满足需要送审条件
    if (category && category.id) {
      let { poiNeedAudits, categoryNeedAudits } = await this.services.fetchNeedAudit(category.id)
      this.data.poiNeedAudit = poiNeedAudits
      this.data.categoryNeedAudit = categoryNeedAudits
      if (changeOrigin) this.data.originalProductCategoryNeedAudit = categoryNeedAudits
    }
  },

  fetchRevocation: async function fetchRevocation () {
    return !!await this.services.fetchRevocationProduct(this.data.product)
  },

  handleRevocation: async function handleRevocation (products, cb) {
    try {
      this.data.product = products
      await this.services.fetchRevocation()
      cb()
    } catch (err) {
      cb(err)
    }
  },

  getDetail: async function getDetail () {
    try {
      const { categoryAttrList, categoryAttrValueMap, ...rest } = await this.services.fetchProductDetail(this.spuId, poiId)
      const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
      this.data.product = { ...rest, ...categoryAttr }
      this.data.originalFormData = cloneDeep(this.data.product) // 对之前数据进行拷贝
    } catch (err) {
      console.error(err)
      this.$Message.error(err.message)
    }
  },

  getSpDetail: async function getSpDetail () {
    try {
      const spDetail = await this.services.fetchSpInfoById(+this.spId)
      const { id, ...rest } = spDetail
      // TODO 和之前逻辑?
      this.data.product = Object.assign({}, rest, { spId: +this.spId, id: undefined })
      this.data.originalFormData = cloneDeep(this.data.product) // 对之前数据进行拷贝
    } catch (err) {
      console.error(err)
      this.$Message.error(err.message)
    }
  },

  handleSubmit: async function handleSubmit (products, context, cb) {
    try {
      this.data.product = products
      const response = await this.services.fetchSubmitEditProduct(context)
      cb(response)
    } catch (err) {
      cb(null, err)
    }
  },

  handleCategoryChange: function handleCategoryChange (products) {
    this.data.product = products
  },

  handleCancel: function handleCancel () {
    this.$tryToNext()
  }
}
