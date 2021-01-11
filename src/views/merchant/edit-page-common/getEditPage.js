import Vue from 'vue'
// import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'
import Loading from '@components/loading/index'
import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import AuditMixinFn from '@/views/components/configurable-form/plugins/audit/auditMixin'

export default ({ Component }) => (Api) => {
  const {
    fetchProductDetail,
    fetchSubmitProduct,
    fetchRevocationProduct
  } = Api
  const AuditMixin = AuditMixinFn(Api)
  return Vue.extend({
    name: 'edit-container',
    data () {
      return {
        product: {}, // 获取的详情数据
        loading: false,
        originalFormData: {} // 获取的初始详情数据拷贝
      }
    },
    mixins: [AuditMixin],
    computed: {
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
        const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, saveType, showLimitSale } = context
        const { ignoreId = null, suggest = { id: '' }, usedSuggestCategory = false } = _SuggestCategory_ || {
          ignoreId: null,
          suggest: { id: '' },
          usedSuggestCategory: false
        }
        const param = {
          isAuditFreeProduct: this.isAuditFreeProduct,
          editType: this.mode,
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
        if (saveType) param.saveType = saveType
        const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
        const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        const response = await fetchSubmitProduct({ ...rest, categoryAttrList, categoryAttrValueMap }, param)
        return response
      },
      async fetchRevocation () {
        const response = await fetchRevocationProduct(this.product.id)
        return response
      },
      async getDetail () {
        try {
          const { categoryAttrList, categoryAttrValueMap, ...rest } = await fetchProductDetail(this.spuId)
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.product = { ...rest, ...categoryAttr }
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          this.product = {}
          this.originalFormData = {}
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleSubmit (product, context, cb) {
        try {
          const response = await this.fetchSubmitEditProduct(context)
          cb(response)
        } catch (err) {
          cb(undefined, err)
        }
      },
      async handleRevocation (product, cb) {
        try {
          await this.fetchRevocation()
          cb()
        } catch (err) {
          cb(err)
        }
      },
      handleProductChange (product) {
        this.product = product
      },
      handleCancel () {
        this.$tryToNext()
      }
    },
    render (h) {
      if (this.loading) {
        return h(Loading)
      } else {
        return h(Component, {
          props: {
            ...this.$attrs,
            product: this.product,
            spId: this.spId,
            spuId: this.spuId,
            isEditMode: this.spuId > 0,
            originalFormData: this.originalFormData,
            poiNeedAudit: this.poiNeedAudit, // 门店开启审核状态
            supportAudit: this.supportAudit, // 是否支持审核状态
            categoryNeedAudit: this.categoryNeedAudit,
            originalProductCategoryNeedAudit: this.originalProductCategoryNeedAudit,
            upcIsSp: this.upcIsSp,
            upcIsAuditPassProduct: this.upcIsAuditPassProduct,
            isAuditFreeProduct: this.isAuditFreeProduct
          },
          on: {
            'change': this.handleProductChange,
            'on-submit': this.handleSubmit,
            'on-cancel': this.handleCancel,
            'on-revocation': this.handleRevocation
          }
        })
      }
    }
  })
}
