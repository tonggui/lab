<template>
  <div>
    <Alert v-if="showWarningTip" type="warning" show-icon>{{ warningTip }}</Alert>
    <Loading v-if="loading" />
    <Form
      v-else
      :changes="changes"
      :spu-id="spuId"
      :tagList="tagList"
      :product="product"
      :suggestNoUpc="noUpc"
      :shortCut="showShortCut"
      :modules="modules"
      :submitting="submitting"
      :categoryTemplateApplying="categoryTemplateApplying"
      :usedBusinessTemplate="usedBusinessTemplate"
      :upcExisted="upcExisted"
      :poiNeedAudit="poiNeedAudit"
      :categoryNeedAudit="categoryNeedAudit"
      :hasFooter="hasFooter"
      @on-confirm="handleConfirm"
      @cancel="handleCancel"
      @showCategoryTemplate="$emit('show-category-template')"
    />
  </div>
</template>

<script>
  import store from '@/store'
  import Form from '@/views/components/product-form/form'

  import { poiId } from '@/common/constants'
  import { EDIT_TYPE } from '@/data/enums/common'
  import {
    PRODUCT_PACK_BAG,
    PRODUCT_SHORTCUT,
    SWITCH_SUGGEST_NOUPC,
    PRODUCT_LIMIT_SALE,
    PRODUCT_SELL_TIME,
    PRODUCT_DESCRIPTION,
    BUSINESS_CATEGORY_TEMPLATE,
    TAG_FIRST_LEVEL_LIMIT,
    POI_CREATE_PRODUCT_AUTO_FILL_TAG
  } from '@/module/moduleTypes'
  import {
    PROPERTY_LOCK,
    WEIGHT_REQUIRED,
    UPC_REQUIRED,
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT,
    PRODUCT_VIDEO
  } from '@/module/subModule/product/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  import { fetchGetProductDetail, fetchSubmitEditProduct, fetchGetNeedAudit } from '@/data/repos/product'
  import { fetchGetTagList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById,
    fetchGetSpInfoByUpc,
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'
  import { QUALIFICATION_STATUS, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import lx from '@/common/lx/lxReport'

  import { getPathById } from '@/components/taglist/util'

  const WRNING_TIP = {
    [PRODUCT_AUDIT_STATUS.AUDITING]: '此商品正在审核中，请等待审核完成或撤销审核后再进行修改',
    [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '商品审核驳回，仍按照原商品信息售卖'
  }

  export default {
    name: 'ProductEdit',
    inject: ['appState'],
    props: {
      mode: {
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return value in EDIT_TYPE
        },
        default: EDIT_TYPE.NORMAL
      },
      categoryTemplateApplying: Boolean, // 分类模板是否正在生成
      usedBusinessTemplate: Boolean // 是否应用了B端分类模板
    },
    components: {
      Form
    },
    async created () {
      const preAsyncTaskList = [
        fetchGetTagList(poiId)
      ]
      try {
        this.loading = true
        const [tagList] = await Promise.all(preAsyncTaskList)
        this.tagList = tagList
        this.loading = false
        if (this.spuId) {
          this.product = await fetchGetProductDetail(this.spuId, poiId, this.mode !== EDIT_TYPE.NORMAL)
          this.checkSpChangeInfo(this.spuId)
          // 查询初始获取到的upc是否在商品库存在
          if (this.product.upcCode) {
            fetchGetSpInfoByUpc(this.product.upcCode, poiId).then(data => {
              if (data) {
                this.upcExisted = true
              }
            })
          }
          // 获取商品是否满足需要送审条件
          if (this.product.category && this.product.category.id) {
            fetchGetNeedAudit(this.product.category.id).then(({ poiNeedAudit, categoryNeedAudit }) => {
              this.poiNeedAudit = poiNeedAudit
              this.categoryNeedAudit = categoryNeedAudit
            })
          }
        } else {
          const { spId } = this.$route.query
          const newProduct = {}
          if (spId) {
            const sp = await fetchGetSpInfoById(+spId, poiId)
            Object.assign(newProduct, sp, { spId: +spId, id: undefined }) // 新建没有商品id，sp的id是标品id
          }
          this.product = newProduct
          this.fillTagByQuery()
        }
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    mounted () {
      this.unsubscribeAction = store.subscribeAction(action => {
        if (action.type === 'categoryTemplate/successBroadcast') {
          fetchGetTagList(poiId).then(data => {
            this.tagList = data
          })
        }
      })
    },
    beforeDestroy () {
      if (this.unsubscribeAction) {
        this.unsubscribeAction()
      }
    },
    data () {
      return {
        loading: false,
        upcExisted: false,
        product: {},
        tagList: [],
        changes: [],
        submitting: false,
        poiNeedAudit: false,
        categoryNeedAudit: false
      }
    },
    computed: {
      showWarningTip () {
        return this.mode === EDIT_TYPE.CHECK_AUDIT && this.warningTip
      },
      warningTip () {
        return WRNING_TIP[this.product.auditStatus] || ''
      },
      hasFooter () {
        return this.mode !== EDIT_TYPE.AUDIT
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      ...mapModule({
        showPackBag: PRODUCT_PACK_BAG,
        showShortCut: PRODUCT_SHORTCUT,
        suggestNoUpc: SWITCH_SUGGEST_NOUPC,
        showLimitSale: PRODUCT_LIMIT_SALE,
        showSellTime: PRODUCT_SELL_TIME,
        showDescription: PRODUCT_DESCRIPTION,
        haveCategoryTemplate: BUSINESS_CATEGORY_TEMPLATE,
        tagLimit: TAG_FIRST_LEVEL_LIMIT,
        needFillTagByQuery: POI_CREATE_PRODUCT_AUTO_FILL_TAG
      }),
      ...mapModule('product', {
        propertyLock: PROPERTY_LOCK,
        weightRequired: WEIGHT_REQUIRED,
        upcRequired: UPC_REQUIRED,
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT,
        showVideo: PRODUCT_VIDEO
      }),
      noUpc () {
        const { id, upcCode } = this.product
        const isCreate = !this.spuId
        return isCreate ? this.suggestNoUpc : !!(id && !upcCode)
      },
      showShortCut () {
        const { id, upcCode } = this.product
        // 审核场景下如果没有upcCode，需要隐藏快捷入口
        return this.mode === EDIT_TYPE.NORMAL ? this.shortCut : !!(id && upcCode)
      },
      modules () {
        const isBatch = !poiId
        return {
          isManager: this.mode === EDIT_TYPE.AUDIT, // 是否为运营审核
          managerEdit: +this.$route.query.isEdit === 1,
          propertyLock: this.propertyLock,
          requiredMap: {
            weight: this.weightRequired,
            upc: this.upcRequired
          },
          sellTime: this.showSellTime,
          picContent: this.showPicContent,
          spPicContent: true,
          description: this.showDescription,
          packingBag: this.showPackBag,
          productVideo: this.showVideo && !isBatch, // 批量不支持视频
          maxTagCount: this.maxTagCount,
          showCellularTopSale: !isBatch,
          haveCategoryTemplate: this.haveCategoryTemplate, // 是否支持分类模板
          tagLimit: this.tagLimit, // 一级店内分类推荐上限值
          limitSale: this.showLimitSale,
          supportAudit: true, // 是否开启审核功能
          editType: this.mode, // 编辑类型：正常编辑
          upcImage: this.mode !== EDIT_TYPE.NORMAL, // 是否始终展示商品条码图组件
          allowBrandApply: true,
          allowAttrApply: true
        }
      }
    },
    watch: {
      needFillTagByQuery: {
        handler (v) {
          this.fillTagByQuery()
        },
        immediate: true
      }
    },
    methods: {
      // 新建时自动根据query上的tagId填充店内分类
      fillTagByQuery () {
        const tagId = +this.$route.query.tagId
        const empty = !this.product.tagList || !this.product.tagList.length
        if (!this.spuId && tagId && this.needFillTagByQuery && empty) {
          const path = getPathById(tagId, this.tagList)
          if (path && path.length) {
            this.product = {
              ...this.product,
              tagList: [{ id: tagId, name: path.name }]
            }
          }
        }
      },
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpUpdateInfoById(spuId, poiId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      async handleConfirm (product, context) {
        const { validType, spChangeInfoDecision = 0 } = context
        try {
          this.submitting = true
          await fetchSubmitEditProduct(product, {
            entranceType: this.$route.query.entranceType,
            dataSource: this.$route.query.dataSource,
            validType
          }, poiId)
          this.submitting = false
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          window.history.go(-1) // 返回
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
          this.handleConfirmError(err, product)
        }
        this.submitting = false
      },
      handleConfirmError (err, product) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            render: () => (
              <ul>
                <li>录入条码与包装上印制的条码不一致</li>
                <li>商品非正规厂商出产，或三无商品：无中文标明产品名称、生产厂厂名、厂址的国产或合资企业产品</li>
                <li>录入条码为店内编码，非通用条形码</li>
                <li>厂商未将条形码在中国物品编码中心（<a href="http://www.ancc.org.cn/" target="_blank">http://www.ancc.org.cn/</a>）备案</li>
                <li>录入条码不符合国际编码规则（国际编码规则：<a href="http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183" target="_blank">http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183</a>）
                </li>
              </ul>
            )
          })
          break
        case 1014:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '提示',
            render: () => (
              <div>
                保存失败，请上传“第二类医疗器械经营备案凭证”、“医疗器械经营许可证”任意一个资质，才允许售卖[避孕套]和[测孕试纸]商品。
                { this.isBusinessClient ? (
                  <div>
                    <br /><br />
                    <div>请前往 <a href="/#/v2/shop/manage/businessQualification" target="_blank">店铺设置-门店管理-营业资质</a></div>
                  </div>
                  ) : <span>请联系商家上传相关资质</span> }
              </div>
            )
          })
          break
        case 1015:
          this.$Modal.confirm({
            title: '提示',
            content: '检测到图片质量过差，将影响订单量和店铺排名，请重新上传',
            okText: '继续保存',
            okType: 'danger',
            cancelText: '去看看',
            onOk: () => this.handleConfirm(product, { validType: 1015 })
          })
          break
        case QUALIFICATION_STATUS.EXP:
        case QUALIFICATION_STATUS.NO:
          qualificationModal(errorMessage)
          break
        default:
          if (this.onConfirmError) {
            this.onConfirmError(err)
          } else {
            this.$Message.error(errorMessage)
          }
          break
        }
        /* eslint-enable indent */
      },
      handleCancel () {
        window.history.go(-1)
      }
    }
  }
</script>
