import Vue from 'vue'
import { categoryTemplateMix } from '@/views/category-template'
import { poiId } from '@/common/constants'
import { cloneDeep } from 'lodash'
import Loading from '@/components/loading' // flash-loading

export default ({ Component }) => (Api) => {
  const {
    fetchGetProductDetail,
    fetchGetSpInfoById,
    fetchGetNeedAudit,
    fetchNormalSubmitEditProduct,
    fetchRevocationSubmitEditProduct
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
        originalProductCategoryNeedAudit: false
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
      async getGetNeedAudit (changeOrigin = false) {
        const { category = { id: '' } } = this.product
        // 获取商品是否满足需要送审条件
        if (category && category.id) {
          const { poiNeedAudit, categoryNeedAudit } = await fetchGetNeedAudit(category.id)
          this.poiNeedAudit = poiNeedAudit
          this.categoryNeedAudit = categoryNeedAudit
          if (changeOrigin) this.originalProductCategoryNeedAudit = categoryNeedAudit
        }
      },
      async fetchSubmitEditProduct (context) {
        const { ignoreId = null, suggest = { id: '' } } = context._SuggestCategory_ || {
          ignoreId: null,
          suggest: { id: '' }
        }
        return !!await fetchNormalSubmitEditProduct(this.product, {
          editType: this.mode,
          entranceType: this.$route.query.entranceType,
          dataSource: this.$route.query.dataSource,
          ignoreSuggestCategory: !!ignoreId,
          suggestCategoryId: suggest.id,
          validType: context.validType,
          needAudit: this.needAudit,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit
        }, poiId)
      },
      async fetchRevocation () {
        return !!await fetchRevocationSubmitEditProduct(this.product)
      },
      async getDetail () {
        try {
          this.product = await fetchGetProductDetail(this.spuId, poiId, false)
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async getSpDetail () {
        try {
          const spDetail = await fetchGetSpInfoById(+this.spId)
          const { id, ...rest } = spDetail
          // TODO 和之前逻辑?
          this.product = Object.assign({}, rest, { spId: +this.spId, id: undefined })
          this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleSubmit (product, context, cb) {
        try {
          this.product = product
          await this.fetchSubmitEditProduct(context)
          cb()
        } catch (err) {
          cb(err)
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
        this.getGetNeedAudit()
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
            originalProductCategoryNeedAudit: this.originalProductCategoryNeedAudit
          },
          on: {
            'on-submit': this.handleSubmit,
            'on-cancel': this.handleCancel,
            'on-revocation': this.handleRevocation,
            'on-catergory-change': this.handleCategoryChange
          }
        })
      }
    }
  })
}
