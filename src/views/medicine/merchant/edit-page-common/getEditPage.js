import Vue from 'vue'
// import { poiId } from '@/common/constants'
import { cloneDeep, debounce, get } from 'lodash'
import Loading from '@components/loading/index'
import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'

export default ({ Component }) => (Api) => {
  const {
    fetchProductDetail,
    fetchSubmitProduct,
    fetchGetSpInfoByUpc
  } = Api
  return Vue.extend({
    name: 'edit-container',
    data () {
      return {
        product: {}, // 获取的详情数据
        loading: false,
        originalFormData: {}, // 获取的初始详情数据拷贝
        poiNeedAudit: false, // 门店开启审核状态
        supportAudit: true, // 是否支持审核状态
        categoryNeedAudit: false,
        originalProductCategoryNeedAudit: false,
        upcIsSp: true // sku中upc是否是标品库存在商品
      }
    },
    computed: {
      spId () {
        return this.$route.query.spId
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      }
    },
    watch: {
      'product.skuList' (newSkuList = [], oldSkuList = []) {
        const newSkuUpcCode = get(newSkuList.find(item => item.editable), 'upcCode', '').trim()
        const oldSkuUpcCode = get(oldSkuList.find(item => item.editable), 'upcCode', '').trim()

        if (newSkuUpcCode && newSkuUpcCode !== oldSkuUpcCode) {
          console.log('获取upcCode合法', newSkuUpcCode)
          this.getUpcIsSp(newSkuUpcCode)
        } else if (!newSkuUpcCode) {
          this.upcIsSp = true
        }
      }
    },
    async created () {
      try {
        this.loading = true
        if (this.spuId) {
          // 编辑模式获取 商品详情
          await this.getDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      getUpcIsSp: debounce(async function (upcCode) {
        try {
          this.upcIsSp = !!await fetchGetSpInfoByUpc(upcCode)
        } catch (err) {
          this.upcIsSp = false
        }
      }, 200),
      async fetchSubmitEditProduct (context) {
        const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, saveType, showLimitSale } = context
        const { ignoreId = null, suggest = { id: '' } } = _SuggestCategory_ || {
          ignoreId: null,
          suggest: { id: '' }
        }
        const param = {
          editType: this.mode,
          entranceType: this.$route.query.entranceType,
          dataSource: this.$route.query.dataSource,
          ignoreSuggestCategory: !!ignoreId,
          suggestCategoryId: suggest.id,
          validType: validType,
          needAudit: needAudit,
          isNeedCorrectionAudit: isNeedCorrectionAudit,
          showLimitSale
        }
        if (saveType) param.saveType = saveType
        const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
        const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        console.log('2121', categoryAttrList, categoryAttrValueMap)
        const response = await fetchSubmitProduct({ ...rest, categoryAttrList, categoryAttrValueMap }, param)
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
            upcIsSp: this.upcIsSp
          },
          on: {
            'change': this.handleProductChange,
            'on-submit': this.handleSubmit,
            'on-cancel': this.handleCancel
          }
        })
      }
    }
  })
}
