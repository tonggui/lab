import Vue from 'vue'
import { categoryTemplateMix } from '@/views/category-template'
import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'
import Loading from '@/components/loading' // flash-loading
// import lx from '@/common/lx/lxReport'
import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import { isEditLimit } from '@/common/product/editLimit'
import AuditMixinFn from '@/views/components/configurable-form/plugins/audit/auditMixin'
import { SKU_FIELD, SPU_FIELD } from '@/views/components/configurable-form/field'

const DETAIL_ATTR_MAP = {
  10: SPU_FIELD.NAME,
  19: SPU_FIELD.CATEGORY,
  5: SPU_FIELD.TAG_LIST,
  20: [SPU_FIELD.PICTURE_LIST, SPU_FIELD.PICTURE_CONTENT],
  23: SPU_FIELD.PRODUCT_VIDEO,
  901: SKU_FIELD.PRICE,
  908: SKU_FIELD.STOCK,
  914: SKU_FIELD.WEIGHT,
  17: SKU_FIELD.MIN_ORDER_COUNT,
  909: SKU_FIELD.BOX,
  912: SKU_FIELD.SOURCE_FOOD_CODE,
  913: SKU_FIELD.UPC_CODE,
  12: SPU_FIELD.DESCRIPTION,
  4: SPU_FIELD.ATTRIBUTE_LIST,
  18: SPU_FIELD.SALE_TIME,
  15: SPU_FIELD.LABEL_LIST,
  903: SPU_FIELD.SELL_STATUS,
  907: SKU_FIELD.SPEC_NAME
}

export default ({ Component }) => (Api) => {
  const {
    fetchProductDetail,
    fetchSpInfoById,
    fetchSubmitProduct,
    fetchRevocationProduct,
    getOdinAuditNeedField
  } = Api
  const AuditMixin = AuditMixinFn(Api)
  return Vue.extend({
    name: 'edit-container',
    inject: ['appState'],
    mixins: [categoryTemplateMix, AuditMixin],
    data () {
      return {
        product: {},
        loading: false,
        originalFormData: {},
        needAuditList: []
      }
    },
    computed: {
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      spId () {
        return this.$route.query.spId
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      }
    },
    async created () {
      try {
        this.loading = true
        if (this.spuId) {
          // 编辑模式获取 商品详情
          await this.getDetail()
          await this.getGetNeedAudit(true)
          await this.getOdinAuditNeedField()
        } else if (this.spId) {
          await this.getSpDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async fetchSubmitEditProduct (context) {
        const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, editType = undefined,
          showLimitSale,
          // _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 },
          isAuditFreeProduct
        } = context
        const { ignoreId = null, suggest = { id: '' }, usedSuggestCategory = false } = _SuggestCategory_ || {
          ignoreId: null,
          suggest: { id: '' },
          usedSuggestCategory: false
        }
        const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
        const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        // op_type 标品更新纠错处理，0表示没有弹窗
        // lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
        const product = { ...rest, categoryAttrList, categoryAttrValueMap }
        const params = {
          isAuditFreeProduct,
          editType,
          entranceType: this.$route.query.entranceType,
          dataSource: this.$route.query.dataSource,
          ignoreSuggestCategory: !!ignoreId,
          suggestCategoryId: suggest.id,
          validType: validType,
          needAudit: needAudit,
          isNeedCorrectionAudit: isNeedCorrectionAudit,
          showLimitSale,
          usedSuggestCategory
        }
        const extra = poiId
        // 活动卡控
        const res = await isEditLimit(fetchSubmitProduct, { product, params: { ...params, checkActivitySkuModify: true }, extra })
        return (typeof res === 'boolean' && res) ? fetchSubmitProduct(product, params, extra) : res
      },
      async fetchRevocation () {
        return !!await fetchRevocationProduct(this.product)
      },
      async getDetail () {
        try {
          const { categoryAttrList, categoryAttrValueMap, ...rest } = await fetchProductDetail(this.spuId, poiId)
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.product = { ...rest, ...categoryAttr }
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          // 普通商品链接加载组包商品，兜底策略
          if (err.code === 8305) {
            this.$router.replace({
              name: 'productPackageEdit',
              query: this.$route.query
            })
          } else {
            this.$Message.error(err.message)
          }
        }
      },
      async getSpDetail () {
        try {
          const spDetail = await fetchSpInfoById(+this.spId)
          const { categoryAttrList, categoryAttrValueMap, ...rest } = spDetail
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)

          this.product = Object.assign({}, rest, categoryAttr, { spId: +this.spId, id: undefined })
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleSubmit (product, context, cb, config) {
        try {
          this.product = product
          const { noMessage } = config
          const response = await this.fetchSubmitEditProduct(context)
          response && !noMessage && this.$Message.success('编辑商品信息成功')
          cb(response)
        } catch (err) {
          cb(null, err)
        }
      },
      async handleRevocation (product, cb) {
        try {
          this.product = product
          await this.fetchRevocation()
          cb()
        } catch (err) {
          cb(err)
        }
      },
      handleCategoryChange (product) {
        this.product = product
      },
      handleCancel () {
        this.$tryToNext()
      },
      async getOdinAuditNeedField () {
        const needAuditList = await getOdinAuditNeedField()
        this.needAuditList = needAuditList.reduce((res, item) => res.concat(DETAIL_ATTR_MAP[item]), [])
      }
    },
    render (h) {
      if (this.loading) {
        return h(Loading)
      } else {
        return h(Component, {
          props: {
            ...this.$props,
            isBusinessClient: this.isBusinessClient,
            product: this.product,
            spId: this.spId,
            spuId: this.spuId,
            isEditMode: this.spuId > 0,
            originalFormData: this.originalFormData,
            poiNeedAudit: this.poiNeedAudit, // 门店开启审核状态
            supportAudit: this.supportAudit, // 是否支持审核状态
            categoryNeedAudit: this.categoryNeedAudit,
            originalProductCategoryNeedAudit: this.originalProductCategoryNeedAudit,
            usedBusinessTemplate: this.usedBusinessTemplate, // 从mixin中获取
            upcIsSp: this.upcIsSp,
            upcIsAuditPassProduct: this.upcIsAuditPassProduct,
            isAuditFreeProduct: this.isAuditFreeProduct,
            businessAuditStatus: this.businessAuditStatus, // 业务审核状态
            complianceAuditStatus: this.complianceAuditStatus, // 合规审核状态
            needAuditList: this.needAuditList // 修改后需审核列表
          },
          on: {
            'on-submit': this.handleSubmit,
            'on-cancel': this.handleCancel,
            'on-revocation': this.handleRevocation,
            'change': this.handleCategoryChange
          }
        })
      }
    }
  })
}
