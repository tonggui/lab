import Vue from 'vue'
import { categoryTemplateMix } from '@/views/category-template'
import { poiId } from '@/common/constants'
import { cloneDeep, get, debounce } from 'lodash'
import Loading from '@/components/loading' // flash-loading
import lx from '@/common/lx/lxReport'
import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import { isEditLimit } from '@/common/product/editLimit'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export default ({ Component }) => (Api) => {
  const {
    fetchProductDetail,
    fetchSpInfoById,
    fetchNeedAudit,
    fetchSubmitProduct,
    fetchRevocationProduct,
    fetchGetSpInfoByUpc,
    fetchGetUpcIsAuditProduct
  } = Api
  return Vue.extend({
    name: 'edit-container',
    inject: ['appState'],
    mixins: [categoryTemplateMix],
    data () {
      return {
        product: {},
        loading: false,
        originalFormData: {},
        poiNeedAudit: false, // 门店开启审核状态
        supportAudit: true, // 是否支持审核状态
        categoryNeedAudit: false,
        originalProductCategoryNeedAudit: false,
        enableStockEditing: true, // 判断商家已创建仓库并有关联添加商品库存,商品编辑页库存编辑状态,true允许编辑
        upcIsSp: true,
        upcIsAuditPassProduct: true
      }
    },
    watch: {
      'product.category.id' (id) {
        // 仅在类目改变时重新获取
        if (id !== get(this.originalFormData, 'category.id')) this.getGetNeedAudit()
      },
      'product.skuList' (newSkuList = [], oldSkuList = []) {
        const newSkuUpcCode = get(newSkuList.find(item => item.editable), 'upcCode', '').trim()
        const oldSkuUpcCode = get(oldSkuList.find(item => item.editable), 'upcCode', '').trim()

        if (newSkuUpcCode && newSkuUpcCode !== oldSkuUpcCode) {
          console.log('获取upcCode合法', newSkuUpcCode)
          this.getUpcIsSp(newSkuUpcCode)
          this.getUpcIsAuditProduct(newSkuUpcCode)
        } else if (!newSkuUpcCode) {
          this.upcIsSp = true
          this.upcIsAuditPassProduct = false
        }
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
      getUpcIsAuditProduct: debounce(async function (upcCode) {
        try {
          this.upcIsAuditPassProduct = !!await fetchGetUpcIsAuditProduct(upcCode, PRODUCT_AUDIT_STATUS.AUDIT_APPROVED)
        } catch (err) {
          this.upcIsAuditPassProduct = false
        }
      }, 200),
      getUpcIsSp: debounce(async function (upcCode) {
        try {
          this.upcIsSp = !!await fetchGetSpInfoByUpc(upcCode)
        } catch (err) {
          this.upcIsSp = false
        }
      }, 200),
      async getGetNeedAudit (changeOrigin = false) {
        const { category = { id: '' } } = this.product
        // 获取商品是否满足需要送审条件
        if (category && category.id) {
          const { poiNeedAudit, categoryNeedAudit } = await fetchNeedAudit(category.id)
          this.poiNeedAudit = poiNeedAudit
          this.categoryNeedAudit = categoryNeedAudit
          if (changeOrigin) this.originalProductCategoryNeedAudit = categoryNeedAudit
        }
      },
      async fetchSubmitEditProduct (context) {
        const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, editType = undefined, showLimitSale, _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 } } = context
        const { ignoreId = null, suggest = { id: '' } } = _SuggestCategory_ || {
          ignoreId: null,
          suggest: { id: '' }
        }
        const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
        const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        // op_type 标品更新纠错处理，0表示没有弹窗
        lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
        const product = { ...rest, categoryAttrList, categoryAttrValueMap }
        const params = {
          editType,
          entranceType: this.$route.query.entranceType,
          dataSource: this.$route.query.dataSource,
          ignoreSuggestCategory: !!ignoreId,
          suggestCategoryId: suggest.id,
          validType: validType,
          needAudit: needAudit,
          isNeedCorrectionAudit: isNeedCorrectionAudit,
          showLimitSale
        }
        const extra = poiId
        // 活动卡控
        const res = await isEditLimit(fetchSubmitProduct, { product, params: { ...params, checkActivitySkuModify: true }, extra })
        return res ? fetchSubmitProduct(product, params, extra) : true
      },
      async fetchRevocation () {
        return !!await fetchRevocationProduct(this.product)
      },
      async getDetail () {
        try {
          const { categoryAttrList, categoryAttrValueMap, enableStockEditing, ...rest } = await fetchProductDetail(this.spuId, poiId)
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.enableStockEditing = enableStockEditing
          // console.log(this.enableStockEditing)
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
      async handleSubmit (product, context, cb) {
        try {
          this.product = product
          const response = await this.fetchSubmitEditProduct(context)
          response && this.$Message.success('编辑商品信息成功')
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
            enableStockEditing: this.enableStockEditing, // 编辑页库存input状态
            upcIsSp: this.upcIsSp,
            upcIsAuditPassProduct: this.upcIsAuditPassProduct
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
