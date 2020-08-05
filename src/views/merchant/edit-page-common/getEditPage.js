import Vue from 'vue'
import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'
import Loading from '@components/loading/index'

export default ({ Component }) => (Api) => {
  const {
    fetchProductDetail,
    fetchNeedAudit,
    fetchSubmitProduct,
    fetchRevocationProduct
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
        originalProductCategoryNeedAudit: false
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
      'product.category' () {
        this.handleCategoryChange()
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
        const { _SuggestCategory_ = {}, needAudit, validType = 0, isNeedCorrectionAudit, saveType } = context
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
          isNeedCorrectionAudit: isNeedCorrectionAudit
        }
        if (saveType) param.saveType = saveType
        return !!await fetchSubmitProduct(this.product, param)
      },
      async fetchRevocation () {
        return !!await fetchRevocationProduct(this.product.id)
      },
      async getDetail () {
        try {
          this.product = await fetchProductDetail(this.spuId, poiId, false)
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          this.product = {}
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleSubmit (product, context, cb) {
        try {
          await this.fetchSubmitEditProduct(context)
          cb()
        } catch (err) {
          cb(err)
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
      handleCategoryChange () {
        this.getGetNeedAudit()
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
            originalProductCategoryNeedAudit: this.originalProductCategoryNeedAudit
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
