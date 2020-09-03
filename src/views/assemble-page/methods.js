import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import lx from '@/common/lx/lxReport'
import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'

export default function (services) {
  const {
    fetchProductDetail, fetchSpInfoById, fetchNeedAudit, fetchSubmitProduct, fetchRevocationProduct
  } = services
  let product = {}
  let originalFormData = {}
  let poiNeedAudit = false
  let supportAudit = true
  let categoryNeedAudit = false
  let originalProductCategoryNeedAudit = false

  const methods = {
    fetchSubmitEditProduct: async function fetchSubmitEditProduct (context) {
      const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, editType = undefined, showLimitSale, _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 } } = context
      const { ignoreId = null, suggest = { id: '' } } = _SuggestCategory_ || {
        ignoreId: null,
        suggest: { id: '' }
      }
      const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = product
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

    getGetNeedAudit: async function getGetNeedAudit (changeOrigin = false) {
      const { category = { id: '' } } = product
      // 获取商品是否满足需要送审条件
      if (category && category.id) {
        let { poiNeedAudits, categoryNeedAudits } = await fetchNeedAudit(category.id)
        poiNeedAudit = poiNeedAudits
        categoryNeedAudit = categoryNeedAudits
        if (changeOrigin) originalProductCategoryNeedAudit = categoryNeedAudit
      }
    },

    fetchRevocation: async function fetchRevocation () {
      return !!await fetchRevocationProduct(product)
    },

    handleRevocation: async function handleRevocation (products, cb) {
      try {
        product = products
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
        product = { ...rest, ...categoryAttr }
        originalFormData = cloneDeep(product) // 对之前数据进行拷贝
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
        product = Object.assign({}, rest, { spId: +this.spId, id: undefined })
        originalFormData = cloneDeep(product) // 对之前数据进行拷贝
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      }
    },

    handleSubmit: async function handleSubmit (products, context, cb) {
      try {
        product = products
        const response = await methods.fetchSubmitEditProduct(context)
        cb(response)
      } catch (err) {
        cb(null, err)
      }
    },

    handleCategoryChange: function handleCategoryChange (products) {
      product = products
    },

    handleCancel: function handleCancel () {
      this.$tryToNext()
    }
  }
  return {
    data: {
      product,
      originalFormData,
      poiNeedAudit,
      supportAudit,
      categoryNeedAudit,
      originalProductCategoryNeedAudit
    },
    methods
  }
}
