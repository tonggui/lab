<template>
  <div class="product-edit">
    <div class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="showWarningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Loading v-if="loading" />
      <Form
        v-else
        ref="form"
        :context="formContext"
        :product="productInfo"
        :submitting="submitting"
        :hasFooter="!isManager"
        :auditBtnText="auditBtnText"
        :isNeedFormValidate="isNeedFormValidate"
        @on-data-change="handleDataChange"
        @on-context-change="handleContextChange"
        @on-confirm="handleConfirm"
        @on-cancel="handleCancel"
        @showCategoryTemplate="$emit('show-category-template')"
      />
    </div>
    <AuditProcess
      ref="process"
      :product="productInfo"
      :show="showProcessList"
    />
  </div>
</template>

<script>
  import store from '@/store'
  import Form from '@/views/new-components/form'
  import { poiId } from '@/common/constants'
  import { isEqual, cloneDeep } from 'lodash'

  import {
    splitCategoryAttrMap,
    combineCategoryMap
  } from '@/views/components/product-form/data'
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
  import { fetchGetProductDetail, fetchSubmitEditProduct, fetchGetCategoryAppealInfo, fetchGetNeedAudit } from '@/data/repos/product'
  import { fetchGetTagList, fetchGetCategoryAttrList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById,
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'
  import { QUALIFICATION_STATUS, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import lx from '@/common/lx/lxReport'
  import { getPathById } from '@/components/taglist/util'
  import AuditProcess from './AuditProcess'
  import { ATTR_TYPE } from '@/data/enums/category'

  const WARNING_TIP = {
    [PRODUCT_AUDIT_STATUS.AUDITING]: '此商品正在审核中，请等待审核完成或撤销审核后再进行修改',
    [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '商品审核驳回，仍按照原商品信息售卖'
  }

  export default {
    name: 'ProductEdit',
    inject: ['appState'],
    props: {
      categoryTemplateApplying: Boolean, // 分类模板是否正在生成
      usedBusinessTemplate: Boolean // 是否应用了B端分类模板
    },
    data () {
      return {
        loading: false,
        upcExisted: false,
        spId: 0,
        tagList: [],
        changes: [],
        submitting: false,
        poiNeedAudit: false,
        categoryNeedAudit: false,
        ignoreSuggestCategoryId: null,
        originalProductCategoryNeedAudit: false,
        product: {},
        productInfo: {},
        formContext: {
          poiId,
          originalFormData: {},
          ignoreSuggestCategoryId: this.ignoreSuggestCategoryId, // 是否暂不使用推荐类目
          categoryTemplateApplying: this.categoryTemplateApplying, // 分类模板应用中
          usedBusinessTemplate: this.usedBusinessTemplate, // 分类模板是否已应用
          spChangeInfoDecision: 0, // 标品字段更新弹框操作类型，0-没弹框，1-同意替换，2-同意但不替换图片，3-关闭，4-纠错
          suggestNoUpc: null,
          shortCut: true,
          changes: [],
          isCreate: null,
          tagList: [],
          normalAttributes: [],
          sellAttributes: [],
          poiNeedAudit: false,
          categoryNeedAudit: false,
          upcExisted: false,
          // 商品来源，默认为空
          productSource: 0,
          needAudit: false,
          isNeedCorrectionAudit: false,
          modules: {}
        }
      }
    },
    components: {
      Form, AuditProcess
    },
    computed: {
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
      // 告警提示文案
      warningTip () {
        return WARNING_TIP[this.productInfo.auditStatus] || ''
      },
      // 是否展示审核步骤
      showProcessList () {
        const list = this.productInfo.taskList
        return (this.$refs['process'] && this.$refs['process'].showList && this.$refs['process'].showList(this.showAuditProcess, list)) || false
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      noUpc () {
        const { id, upcCode } = this.productInfo
        const isCreate = !this.spuId
        return isCreate ? this.suggestNoUpc : !!(id && !upcCode)
      },
      modules () {
        const isBatch = !poiId
        return {
          isManager: this.isManager, // 是否为运营审核
          managerEdit: +this.$route.query.isEdit === 1,
          propertyLock: this.propertyLock && !this.isManager, // 运营审核不需要受到字段可编辑控制
          editType: this.mode,
          upcImage: this.showUpcImage, // 是否始终展示商品条码图组件
          requiredMap: {
            weight: this.weightRequired,
            // https://km.sankuai.com/page/331245835
            // 如果有标品ID，upc变成选填
            upc: this.upcRequired && !this.spId
          },
          sellTime: this.showSellTime,
          picContent: this.showPicContent,
          description: this.showDescription,
          packingBag: this.showPackBag,
          productVideo: this.showVideo && !isBatch, // 批量不支持视频
          maxTagCount: this.maxTagCount,
          haveCategoryTemplate: this.haveCategoryTemplate, // 是否支持分类模板
          tagLimit: this.tagLimit, // 一级店内分类推荐上限值
          limitSale: this.showLimitSale,
          showCellularTopSale: !isBatch,
          allowSuggestCategory: this.allowSuggestCategory, // 非审核场景才需要展示类目推荐
          supportAudit: true, // 是否开启审核功能
          spPicContent: true,
          allowBrandApply: true,
          allowAttrApply: true
        }
      }
    },
    watch: {
      ignoreSuggestCategoryId (val) {
        this.formContext = {
          ...this.formContext,
          ignoreSuggestCategoryId: val
        }
      },
      categoryTemplateApplying (val) {
        this.formContext = {
          ...this.formContext,
          categoryTemplateApplying: val
        }
      },
      usedBusinessTemplate (val) {
        this.formContext = {
          ...this.formContext,
          usedBusinessTemplate: val
        }
      },
      noUpc (val) {
        this.formContext = {
          ...this.formContext,
          suggestNoUpc: val
        }
      },
      showShortCut (val) {
        this.formContext = {
          ...this.formContext,
          shortCut: val
        }
      },
      changes (val) {
        this.formContext = {
          ...this.formContext,
          changes: val
        }
      },
      spuId (val) {
        this.formContext = {
          ...this.formContext,
          isCreate: !val
        }
      },
      tagList (val) {
        this.formContext = {
          ...this.formContext,
          tagList: val
        }
      },
      poiNeedAudit (val) {
        this.formContext = {
          ...this.formContext,
          poiNeedAudit: val
        }
      },
      categoryNeedAudit (val) {
        this.formContext = {
          ...this.formContext,
          categoryNeedAudit: val
        }
      },
      upcExisted (val) {
        this.formContext = {
          ...this.formContext,
          upcExisted: val
        }
      },
      needAudit (val) {
        this.formContext = {
          ...this.formContext,
          needAudit: val
        }
      },
      isNeedCorrectionAudit (val) {
        console.log('变了吗', val)
        this.formContext = {
          ...this.formContext,
          isNeedCorrectionAudit: val
        }
      },
      modules: {
        immediate: true,
        deep: true,
        handler (val) {
          this.formContext = {
            ...this.formContext,
            modules: val
          }
        }
      },
      needFillTagByQuery: {
        handler (v) {
          this.fillTagByQuery()
        },
        immediate: true
      },
      product: {
        deep: true,
        handler (product) {
          const { categoryAttrList, categoryAttrValueMap } = product
          const {
            normalAttributes,
            normalAttributesValueMap,
            sellAttributes,
            sellAttributesValueMap
          } = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          this.productInfo = {
            ...this.product,
            normalAttributesValueMap,
            sellAttributesValueMap
          }
          this.formContext = {
            ...this.formContext,
            originalFormData: cloneDeep(this.productInfo),
            productSource: this.product.productSource || 0, // TODO
            normalAttributes,
            sellAttributes
          }
        }
      }
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const newData = this.productInfo
          const oldData = this.formContext.originalFormData
          console.log('oldData-newData', newData, oldData)
          if (newData.upcCode !== oldData.upcCode) return true
          if ((!newData.category && oldData.category) || (newData.category && !oldData.category) || (newData.category.id !== oldData.category.id)) return true
          let isSpecialAttrEqual = true
          for (let i = 0; i < this.formContext.normalAttributes.length; i++) {
            const attr = this.formContext.normalAttributes[i]
            if (attr.attrType === ATTR_TYPE.SPECIAL) {
              if (!isEqual(newData.normalAttributesValueMap[attr.id], oldData.normalAttributesValueMap[attr.id])) {
                isSpecialAttrEqual = false
                break
              }
            }
          }
          return !isSpecialAttrEqual
        }
        return false
      },
      handleChangeSpId (spId) {
        this.spId = spId
      },
      // 新建时自动根据query上的tagId填充店内分类
      fillTagByQuery () {
        const tagId = +this.$route.query.tagId
        const empty = !this.productInfo.tagList || !this.productInfo.tagList.length
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
        if (!this.needCheckSpChangeInfo) return
        try {
          // 获取标品更新信息 (retail/v2/r/getChangeInfo)
          const changes = await fetchGetSpUpdateInfoById(spuId, poiId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      checkSuggestCategory () {
        const decision = this.formContext.spChangeInfoDecision
        const id = this.productInfo.id
        const { modules, suggestCategory, ignoreSuggestCategoryId, normalAttributes, sellAttributes } = this.formContext
        const { normalAttributesValueMap, sellAttributesValueMap, category, spId } = this.productInfo
        const {
          categoryAttrList,
          categoryAttrValueMap
        } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
        const suggestCategoryId = (suggestCategory || {}).id
        return new Promise((resolve, reject) => {
          if (modules.allowSuggestCategory && !spId && suggestCategoryId && suggestCategoryId !== category.id && ignoreSuggestCategoryId !== suggestCategoryId) {
            lx.mc({
              bid: 'b_a3y3v6ek',
              val: {
                spu_id: id,
                op_type: decision,
                op_res: 0,
                fail_reason: `前端校验失败：商品类目与推荐类目不符`
              }
            })
            // 类目推荐校验mv，只记录初次
            if (!this.suggestValidateMV) {
              this.suggestValidateMV = true
              lx.mv({
                bid: 'b_shangou_online_e_zyic9lks_mv',
                val: { product_spu_name: this.productInfo.name, tag_id: suggestCategoryId }
              })
            }
            this.$Modal.confirm({
              title: '注意',
              centerLayout: true,
              okText: '使用推荐类目',
              cancelText: '继续保存',
              render () {
                return (
                  <div>
                    <div>系统检测到您的商品可能与已填写的类目不符合，建议使用推荐类目：如您选择“继续保存”，平台将对您的商品进行审核</div>
                    <div>1) 审核通过，则您的商品将可以正常售卖</div>
                    <div class="danger">2) 审核不通过，将降低您门店内的商品曝光</div>
                    <div>审核周期：1-7个工作日，审核期间您可以正常售卖</div>
                  </div>
                )
              },
              onOk: () => {
                lx.mc({ bid: 'b_shangou_online_e_57vvinqj_mc' })
                this.productInfo = {
                  ...this.productInfo,
                  category: {
                    id: suggestCategory.id,
                    idPath: suggestCategory.idPath,
                    name: suggestCategory.name,
                    namePath: suggestCategory.namePath,
                    isLeaf: suggestCategory.isLeaf,
                    level: suggestCategory.level
                  }
                }
                fetchGetCategoryAttrList(suggestCategoryId).then(attrs => {
                  const oldNormalAttributesValueMap = this.productInfo.normalAttributesValueMap
                  const oldSellAttributesValueMap = this.productInfo.sellAttributesValueMap
                  const oldSellAttributes = this.formContext.sellAttributes
                  const {
                    normalAttributes,
                    normalAttributesValueMap,
                    sellAttributes,
                    sellAttributesValueMap
                  } = splitCategoryAttrMap(attrs, { ...oldNormalAttributesValueMap, ...oldSellAttributesValueMap })
                  this.formContext = {
                    ...this.formContext,
                    normalAttributes,
                    sellAttributes
                  }
                  const newProductInfo = {
                    ...this.productInfo,
                    normalAttributesValueMap,
                    sellAttributesValueMap
                  }
                  if (sellAttributes.length > 0 || oldSellAttributes.length > 0) {
                    newProductInfo.skuList = []
                  }
                  this.productInfo = newProductInfo
                })
              },
              onCancel: () => {
                lx.mc({ bid: 'b_shangou_online_e_tuexnuui_mc' })
                this.formContext = {
                  ...this.formContext,
                  ignoreSuggestCategoryId: suggestCategoryId
                }
                this.productInfo = {
                  ...this.productInfo,
                  categoryAttrList,
                  categoryAttrValueMap
                }
                this.formContext = {
                  ...this.formContext,
                  spChangeInfoDecision: decision,
                  ignoreSuggestCategory: true,
                  suggestCategoryId: suggestCategoryId
                }
                resolve()
              }
            })
          } else {
            this.productInfo = {
              ...this.productInfo,
              categoryAttrList,
              categoryAttrValueMap
            }
            this.formContext = {
              ...this.formContext,
              spChangeInfoDecision: decision,
              ignoreSuggestCategory: !!suggestCategoryId && ignoreSuggestCategoryId === suggestCategoryId,
              suggestCategoryId: suggestCategoryId
            }
            resolve()
          }
        })
      },
      async handleSubmit (product, context) {
        const { validType, spChangeInfoDecision = 0, ignoreSuggestCategory, suggestCategoryId, needAudit, isNeedCorrectionAudit } = this.formContext
        try {
          this.submitting = true
          await fetchSubmitEditProduct(this.productInfo, {
            editType: this.mode,
            entranceType: this.$route.query.entranceType,
            dataSource: this.$route.query.dataSource,
            ignoreSuggestCategory,
            suggestCategoryId,
            validType,
            needAudit,
            isNeedCorrectionAudit
          }, poiId)
          this.submitting = false
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          // TODO
          // 正常新建编辑场景下如果提交审核需要弹框
          if (needAudit && this.needConfirmModal) {
            lx.mv({
              bid: 'b_shangou_online_e_nwej6hux_mv',
              val: { spu_id: this.spuId || 0 }
            })
            this.$Modal.confirm({
              title: `商品${this.productInfo.id ? '修改' : '新建'}成功`,
              content: '<div><p>商品审核通过后才可正常售卖，预计1-2个工作日完成审核，请耐心等待。</p><p>您可以在【商品审核】中查看审核进度。</p></div>',
              centerLayout: true,
              iconType: null,
              okText: '返回商品列表',
              cancelText: '查看商品审核',
              onOk: () => {
                this.handleCancel() // 返回
              },
              onCancel: () => {
                lx.mc({
                  bid: 'b_shangou_online_e_uxik0xal_mc',
                  val: { spu_id: this.spuId || 0 }
                })
                this.$router.replace({ name: 'productAuditList', query: { wmPoiId: poiId } })
              }
            })
          } else {
            this.handleCancel() // 返回
          }
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
          this.handleConfirmError(err, this.productInfo, this.formContext)
        }
        this.submitting = false
      },
      handleConfirmError (err, product, context) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: err.message
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
            onOk: () => this.handleConfirm(product, { ...context, validType: 1015 })
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
        this.$tryToNext()
      },
      handleDataChange (data) {
        this.productInfo = data
      },
      handleContextChange (context) {
        this.formContext = context
      }
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
          // 获取商品类目申报信息 (hqcc/r/getCategoryAppealInfo)
          fetchGetCategoryAppealInfo(this.spuId).then(categoryAppealInfo => {
            if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
              // 是否暂不使用推荐类目
              this.ignoreSuggestCategoryId = categoryAppealInfo.suggestCategoryId
            }
          })
          // TODO
          // 获取商品详细信息 (shangou/r/detailProduct)
          this.product = await fetchGetProductDetail(this.spuId, poiId, !this.needConfirmModal)
          this.checkSpChangeInfo(this.spuId)
          // 获取商品是否满足需要送审条件
          if (this.product.category && this.product.category.id) {
            fetchGetNeedAudit(this.product.category.id).then(({ poiNeedAudit, categoryNeedAudit }) => {
              this.poiNeedAudit = poiNeedAudit
              this.categoryNeedAudit = categoryNeedAudit
              this.originalProductCategoryNeedAudit = categoryNeedAudit
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
    }
  }
</script>

<style lang="less" scoped>
  .product-edit {
     display: flex;
     width: 100%;
     .form-container {
       width: 100%;
       &.with-task-list {
         width: 75%;
       }
     }
    /*.audit-process-container {*/
    /*  flex: 1;*/
    /*  margin: 0 0 66px 10px;*/
    /*  background: #fff;*/
    /*  .sticky {*/
    /*    position: sticky;*/
    /*    top: 0;*/
    /*  }*/
    /*}*/
  }
</style>
