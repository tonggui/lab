<template>
  <div class="product-edit">
    <div class="form-container" :class="{ 'with-task-list': showAuditTaskList }">
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
        :ignoreSuggestCategoryId="ignoreSuggestCategoryId"
        :categoryTemplateApplying="categoryTemplateApplying"
        :usedBusinessTemplate="usedBusinessTemplate"
        :upcExisted="upcExisted"
        :poiNeedAudit="poiNeedAudit"
        :categoryNeedAudit="categoryNeedAudit"
        :hasFooter="!isManager"
        @on-confirm="handleConfirm"
        @cancel="handleCancel"
        @showCategoryTemplate="$emit('show-category-template')"
      />
    </div>
    <div class="audit-process-container" v-if="showAuditTaskList">
      <AuditProcess class="sticky" :steps="auditTaskList" :current="auditCurrentTask" :status="auditStatus" :formatter="auditTaskFormat" />
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import findLastIndex from 'lodash/findLastIndex'
  import findIndex from 'lodash/findIndex'
  import Form from '@/views/components/product-form/form'
  import AuditProcess from '@/components/audit-process'

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

  import { fetchGetProductDetail, fetchSubmitEditProduct, fetchGetCategoryAppealInfo, fetchGetNeedAudit } from '@/data/repos/product'
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

  const WARNING_TIP = {
    [PRODUCT_AUDIT_STATUS.AUDITING]: '此商品正在审核中，请等待审核完成或撤销审核后再进行修改',
    [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '商品审核驳回，仍按照原商品信息售卖'
  }

  const errorAuditStatus = {
    3: '审核驳回',
    4: '审核驳回'
  }

  const auditStatusText = {
    1: '审核中',
    2: '审核通过',
    6: '审核撤销',
    7: '审核中', // 审核驳回待审核
    ...errorAuditStatus
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
      Form, AuditProcess
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
          fetchGetCategoryAppealInfo(this.spuId).then(categoryAppealInfo => {
            if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
              this.ignoreSuggestCategoryId = categoryAppealInfo.suggestCategoryId
            }
          })
          this.product = await fetchGetProductDetail(this.spuId, poiId, this.mode !== EDIT_TYPE.NORMAL)
          this.checkSpChangeInfo(this.spuId)
          // 查询初始获取到的upc是否在商品库存在
          if (this.product.upcCode) {
            fetchGetSpInfoByUpc(this.product.upcCode, poiId).then(data => {
              if (data) {
                this.upcExisted = true
              }
            }).catch(e => console.error(`查询UPC是否存在失败: ${e}`))
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
        categoryNeedAudit: false,
        ignoreSuggestCategoryId: null
      }
    },
    computed: {
      showWarningTip () {
        return this.mode === EDIT_TYPE.CHECK_AUDIT && this.warningTip
      },
      warningTip () {
        return WARNING_TIP[this.product.auditStatus] || ''
      },
      showAuditTaskList () {
        return this.mode === EDIT_TYPE.CHECK_AUDIT && this.auditTaskList.length > 1
      },
      isManager () {
        return this.mode === EDIT_TYPE.AUDIT
      },
      auditTaskList () {
        const taskList = this.product.taskList || []
        return [...taskList, { nodeName: '商品审核完成' }]
      },
      auditCurrentTask () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.auditTaskList.length
        }
        const taskList = this.product.taskList || []
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        let idx = findIndex(taskList, [1, 7].includes(taskList.auditState))
        if (idx > -1) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }
        return idx > -1 ? idx : 0
      },
      auditStatus () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.product.taskList || []
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
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
          isManager: this.isManager, // 是否为运营审核
          managerEdit: +this.$route.query.isEdit === 1,
          propertyLock: this.propertyLock && this.mode !== EDIT_TYPE.AUDIT, // 运营审核不需要受到字段可编辑控制
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
          allowSuggestCategory: true,
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
      // 审核记录展示
      auditTaskFormat (task, key, i) {
        if (key === 'title') {
          return auditStatusText[task.auditState] ? `${task.nodeName} - ${auditStatusText[task.auditState]}` : task.nodeName
        }
        return errorAuditStatus[task.auditState] ? (`驳回原因：${task.comment || ''}`) : ''
      },
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
        // 非普通编辑模式，不获取字段更新的逻辑
        if (this.mode !== EDIT_TYPE.NORMAL) return
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
        const { validType, spChangeInfoDecision = 0, ignoreSuggestCategory, suggestCategoryId, needAudit, isNeedCorrectionAudit } = context
        try {
          this.submitting = true
          await fetchSubmitEditProduct(product, {
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
          // 正常新建编辑场景下如果提交审核需要弹框
          if (needAudit && this.mode === EDIT_TYPE.NORMAL) {
            lx.mv({
              bid: 'b_shangou_online_e_nwej6hux_mv',
              val: { spu_id: this.spuId || 0 }
            })
            this.$Modal.confirm({
              title: `商品${product.id ? '修改' : '新建'}成功`,
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
          this.handleConfirmError(err, product, context)
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
    .audit-process-container {
      flex: 1;
      margin: 0 0 66px 10px;
      background: #fff;
      .sticky {
        position: sticky;
        top: 0;
      }
    }
  }
</style>
