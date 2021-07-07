import Vue from 'vue'
import { cloneDeep, get } from 'lodash'
import Loading from '@/components/loading' // flash-loading
import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'
import { isEditLimit } from '@/common/product/editLimit'
import AuditMixinFn from '@/views/components/configurable-form/plugins/audit/auditMixin'
import { uuid } from '@utiljs/guid'
import { categoryTemplateMix } from '@/views/category-template'
import { poiId } from '@/common/constants'
import { DETAIL_ATTR_MAP } from '@/views/components/configurable-form/field'
import { SearchTime } from '@/common/lx/lxReport/lxTime'

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
        // 埋点信息
        const traceId = uuid()
        const others = {
          traceId,
          biz: get(this, '$route.query.spId') ? '从商品库新建（单店）' : (window.page_source === 3 ? '经营分析商家体检新建（单店）' : (SearchTime.getSearchTime() ? '单个商品搜索新建（单店）' : '单个商品手动新建（单店）')),
          ext: get(window, 'page_source_param.task_id')
        }
        // 活动卡控
        const res = await isEditLimit(fetchSubmitProduct, { product, params: { ...params, checkActivitySkuModify: true }, extra, others })
        if (typeof res === 'boolean' && res) {
          const response = await fetchSubmitProduct(product, params, extra, others)
          return {
            ...response,
            traceId,
            isFetchSubmit: true
          }
        } else {
          return res
        }
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
      async handleSubmit (product, context, cb, config = {}) {
        let response = null
        try {
          this.product = product
          /**
           * 加入兜底逻辑
           * TODO 由于数据分析发现接口请求已上报埋点，但是前端漏报，猜测是否因为（response后cb前）报错，导致未上报前端埋点
            */
          let noMessage = false
          if (config && typeof config === 'object') {
            noMessage = config.noMessage
          }
          response = await this.fetchSubmitEditProduct(context)
          if (response && !noMessage) this.$Message.success('编辑商品信息成功')
          cb(response)
        } catch (err) {
          /**
           * TODO 如果response存在，则判定接口请求成功，保证前后端埋点一致性，判断为返回结果正确，允许走入后续流程，保证前端埋点正常上报
           */
          if (response && response.isFetchSubmit) {
            cb(response)
          } else {
            cb(null, err)
          }
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
