<template>
  <div class="combine-product-edit" :data-lx-param="param">
    <Alert v-if="showMissingInfoTip" class="sticky-alert" type="error" show-icon>必填信息缺失，商品无法上架售卖。请尽快补⻬所有必填信息(“*”标识项)</Alert>
    <Form
      v-model="productInfo"
      navigation
      ref="form"
      :footer-btn-type="btnType"
      need-permission
      :confirmText="auditBtnText"
      :context="context"
      :disabled="editNotPermission"
      :is-edit-mode="isEditMode"
      @validate-error="handleValidateError"
      @confirm-click="handleConfirmClick"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import { get, isFunction } from 'lodash'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { buildCustomLxProvider } from '@/mixins/lx/provider'
  import { LX, LXContext } from '@/common/lx/lxReport'
  import TimeCounters, { FillTime, SearchTime } from '@/common/lx/lxReport/lxTime'

  import { PRODUCT_AUDIT_STATUS, BUSINESS_AUDIT_TYPE, COMPLIANCE_AUDIT_TYPE } from '@/data/enums/product'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { poiId, decodeParamsFromURLSearch } from '@/common/constants'
  import errorHandler from '../edit-page-common/error'
  import { diffCommon, diffKeyAttrs } from '@/common/product/audit'
  import { contextSafetyWrapper, getProductChangInfo } from '@/common/utils'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  export default {
    name: 'combine-product-edit',
    mixins: [getPermissionMixin()],
    props: {
      isBusinessClient: Boolean,
      product: Object,
      spId: [Number, String],
      spuId: [Number, String],
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      businessAuditStatus: Number, // 业务审核状态
      complianceAuditStatus: Number, // 合规审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean,
      usedBusinessTemplate: Boolean,
      upcIsSp: Boolean,
      upcIsAuditPassProduct: Boolean,
      isAuditFreeProduct: Boolean,
      needAuditList: Array
    },
    provide () {
      return {
        needAudit: () => this.needAudit,
        ...buildCustomLxProvider(function (prev) {
          return Object.assign({}, prev, {
            spu_id: +this.spuId || 0,
            st_spu_id: get(this.productInfo, 'spId', 0)
          })
        })
      }
    },
    components: { Form },
    data () {
      return {
        needPermission: true,
        btnType: this.spuId ? 'EDIT' : 'CREATE'
      }
    },
    computed: {
      param () {
        return JSON.stringify({
          'product_spu_name': this.product.name,
          spu_id: this.spuId || 0,
          create_source: decodeParamsFromURLSearch('awardCode') ? 5 : 14,
          task_id: decodeParamsFromURLSearch('awardCode') ? get(decodeParamsFromURLSearch('awardCode'), 'taskId') : ''
        })
      },
      productInfo: {
        get () {
          return this.product
        },
        set (product) {
          this.$emit('change', product)
        }
      },
      auditStatus () {
        return this.productInfo.auditStatus
      },
      auditBtnStatus () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return 'REVOCATION'
        // 新建
        if (!this.spuId && (this.businessNeedAudit || this.complianceNeedAudit)) {
          return 'SUBMIT'
        }
        return (this.needAudit && this.businessNeedAudit) || this.complianceNeedAuditTip ? 'SUBMIT' : !this.spuId ? 'PUBLISH'
          : [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED, PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION].includes(this.auditStatus) ? 'SUBMIT' : 'SAVE' // 业务审核驳回、撤销审核的商品保存按钮文案默认为“提交审核”
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      showMissingInfoTip () {
        return get(this.productInfo, 'isMissingInfo', false)
      },
      // 是否类目推荐
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.auditStatus)
      },
      isCreateMode () {
        if (!this.spuId) return true
        if (get(this.productInfo, 'isMissingInfo', false)) return true
        return false
      },
      // 新建场景下是否需要审核
      createNeedAudit () {
        // 新建模式，标品库存在的非标品不走审核逻辑
        return this.categoryNeedAudit && !this.productInfo.spId
      },
      // 编辑场景下是否需要审核
      editNeedAudit () {
        if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
          return this.checkCateNeedAudit()
        } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }
        return false
      },
      realNeedAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        if (this.isCreateMode) {
          return this.createNeedAudit
        } else {
          return this.editNeedAudit
        }
      },
      // 商家是否需要提交审核
      needAudit () {
        if (this.isProductAuditFree) return false
        return this.realNeedAudit
      },
      complianceNeedAuditTip () {
        if (this.isCreateMode) return false // 新建场景不可能是纠错
        if (!this.poiNeedAudit) return false // 门店审核状态
        if (this.isProductAuditFree) return false // 免审

        // 当前是opLog配置的修改后需审核的字段，并且是合规审核需要提示（先审后发）
        return this.complianceNeedAudit && this.checkComplianceNeedAuditTip()
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (this.isCreateMode) return false // 新建场景不可能是纠错
        if (!this.poiNeedAudit) return false // 门店审核状态

        return this.checkCateNeedAudit()
      },
      // 是否是免审
      isProductAuditFree () {
        if (!this.realNeedAudit) return false
        return (![PRODUCT_AUDIT_STATUS.AUDITING, PRODUCT_AUDIT_STATUS.START_SELL_AUDITING].includes(this.productInfo.auditStatus) && this.isAuditFreeProduct)
      },
      // 业务审核 先审后发
      businessNeedAudit () {
        return this.businessAuditStatus === BUSINESS_AUDIT_TYPE.START_AUDIT
      },
      // 合规审核 先审后发
      complianceNeedAudit () {
        return this.complianceAuditStatus === COMPLIANCE_AUDIT_TYPE.START_AUDIT
      },
      context () {
        return {
          field: {
            [SPU_FIELD.TAG_LIST]: {
              required: !this.usedBusinessTemplate // 从mixin获取
            },
            [SPU_FIELD.UPC_IMAGE]: { // upcImage判断逻辑更改
              visible: this.needAudit && !this.upcIsSp && !this.upcIsAuditPassProduct
            }
          },
          features: {
            navigation: true,
            spuId: this.spuId,
            showCellularTopSale: true,
            audit: {
              originalProduct: this.originalFormData,
              approveSnapshot: this.productInfo.approveSnapshot,
              needCorrectionAudit: this.isNeedCorrectionAudit && !this.isProductAuditFree,
              snapshot: this.productInfo.snapshot,
              productSource: this.productInfo.productSource,
              businessNeedAudit: this.businessNeedAudit,
              complianceNeedAuditTip: this.complianceNeedAuditTip,
              needAuditList: this.needAuditList
            },
            allowCorrectSp: true,
            allowSuggestCategory: this.allowSuggestCategory // 根据审核变化
          }
        }
      },
      editNotPermission () {
        return !this.havePermission && this.spuId
      }
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const newData = this.productInfo
          const oldData = this.originalFormData
          return diffKeyAttrs(oldData, newData)
        }
        return false
      },
      checkComplianceNeedAuditTip () {
        // 合规审核只需要判断时候是先审后发，不用判断类目是否需要审核originalProductCategoryNeedAudit，这个是业务审核的
        const newData = this.productInfo
        const oldData = this.originalFormData
        return diffCommon(oldData, newData, this.needAuditList)
      },
      getModalTipAndText () {
        let tip = []
        let okText = '返回商品列表'
        let cancelText = '查看商品审核'
        // 合规审核为先发后审、需业务审核且为先审后发, 或者编辑商品页面时无需合规审核
        if ((this.complianceAuditStatus === COMPLIANCE_AUDIT_TYPE.START_SELL ||
          this.complianceAuditStatus === COMPLIANCE_AUDIT_TYPE.NO_AUDIT) &&
          this.businessAuditStatus === BUSINESS_AUDIT_TYPE.START_AUDIT
        ) {
          tip = [
            '此商品已送平台业务审核，预计1-2个工作日审核完毕。',
            '审核中、审核驳回商品，不可售卖。',
            '您可在【商品审核】查看业务审核进度。'
          ]
        }
        // 合规审核为先审后发、不需业务送审或业务审核为先发后审
        if (this.complianceAuditStatus === COMPLIANCE_AUDIT_TYPE.START_AUDIT &&
          (this.businessAuditStatus === BUSINESS_AUDIT_TYPE.NO_AUDIT ||
          this.businessAuditStatus === BUSINESS_AUDIT_TYPE.START_SELL)
        ) {
          tip = [
            '此商品已送平台合规审核，预计1个工作日内审核完毕。',
            '审核中、审核驳回商品，不可售卖。',
            '您可在【商品列表】查看合规审核进度。'
          ]
          cancelText = ''
        }
        // 合规审核、业务审核均为先审后发
        if (this.complianceAuditStatus === COMPLIANCE_AUDIT_TYPE.START_AUDIT &&
          this.businessAuditStatus === BUSINESS_AUDIT_TYPE.START_AUDIT
        ) {
          tip = [
            '此商品已送平台合规审核、业务审核。预计1-2个工作日审核完毕。审核中、审核驳回商品不可售卖。',
            '您可在【商品审核】查看业务审核进度；业务审核通过后，可在【商品列表】查看合规审核进度。'
          ]
        }
        return {
          tip,
          okText,
          cancelText
        }
      },
      // 提交后弹窗
      popConfirmModal (response) {
        // 获取弹窗提示信息
        const { tip, okText, cancelText } = this.getModalTipAndText()
        // 正常新建编辑场景下如果提交审核需要弹框, 并且需要满足审核条件
        if (this.auditBtnStatus === 'SUBMIT' && tip.length) {
          LX.mv({
            bid: 'b_shangou_online_e_nwej6hux_mv',
            val: { spu_id: this.spuId || 0 }
          })
          const showModal = cancelText ? this.$Modal.confirm : this.$Modal.success
          const $modal = showModal({
            title: `商品${this.productInfo.id ? '修改' : '新建'}成功`,
            content: `<div>${tip.map(t => `<p>${t}</p>`).join('')}</div>`,
            centerLayout: true,
            iconType: null,
            scrollable: true,
            okText,
            cancelText,
            onOk: () => {
              if ($modal.destroy && isFunction($modal.destroy)) $modal.destroy()
              this.handleCancel() // 返回
            },
            onCancel: () => {
              LX.mc({
                bid: 'b_shangou_online_e_uxik0xal_mc',
                val: { spu_id: this.spuId || 0 }
              })
              if ($modal.destroy && isFunction($modal.destroy)) $modal.destroy()
              this.$router.replace({ name: 'productAuditList', query: { wmPoiId: poiId } })
            }
          })
        } else {
          if (!this.spuId) {
            this.$Message.success('创建商品成功')
          } else {
            this.$Message.success('编辑商品成功')
          }
          this.handleCancel() // 返回
        }
      },
      handleConfirmClick () {
        const isRecommendTag = (this.productInfo.tagList || []).some(tag => !!tag.isRecommend)
        LX.mc({
          bid: 'b_cswqo6ez',
          val: {
            spu_id: this.spuId,
            op_type: this.getSpChangeInfoDecision(),
            is_rcd_tag: isRecommendTag
          }
        })
      },
      getSpChangeInfoDecision () {
        const pluginContext = this.$refs.form.form.getPluginContext()
        return get(pluginContext, '_SpChangeInfo_.spChangeInfoDecision') || ''
      },
      handleCancel () {
        this.$emit('on-cancel')
      },
      handleValidateError (error) {
        const spChangeInfoDecision = this.getSpChangeInfoDecision()
        LX.mc({
          bid: 'b_a3y3v6ek',
          val: {
            spu_id: this.spuId,
            op_type: spChangeInfoDecision,
            op_res: 0,
            fail_reason: `前端校验失败：${error || ''}`,
            st_spu_id: this.product.spId || 0,
            page_source: 0
          }
        })
      },
      async handleConfirm (callback, context = {}) {
        if (this.needAudit) {
          // 点击重新提交审核/重新提交审核
          LX.mc({
            bid: 'b_shangou_online_e_3ebesqok_mc',
            val: { spu_id: this.spuId }
          })
        }
        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          isAuditFreeProduct: this.isProductAuditFree,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.realNeedAudit,
          showLimitSale,
          ...this.$refs.form.form.getPluginContext()
        }
        const cb = contextSafetyWrapper((response, err) => {
          const spChangeInfoDecision = this.getSpChangeInfoDecision()
          let bid = 'null'
          if (err) {
            const { _SpChangeInfo_: { spChangeInfoDecision } = { spChangeInfoDecision: 0 } } = this.$refs.form.form.getPluginContext()
            LX.mc({
              bid: 'b_a3y3v6ek',
              val: {
                op_type: spChangeInfoDecision,
                op_res: 0,
                fail_reason: `${err.code}: ${err.message}`,
                spu_id: this.spuId || 0,
                st_spu_id: this.product.spId || 0,
                page_source: 0
              }
            })
            bid = 'b_a3y3v6ek'
            errorHandler(err)({
              isBusinessClient: this.isBusinessClient,
              confirm: this.handleConfirm
            })
          } else {
            FillTime.fillEndTime = +new Date()
            LX.mc({
              bid: 'b_a3y3v6ek',
              val: {
                op_type: spChangeInfoDecision,
                op_res: 1,
                fail_reason: '',
                spu_id: this.spuId || response.id || 0,
                st_spu_id: this.product.spId || 0,
                page_source: 0
              }
            })
            bid = 'b_a3y3v6ek'
            if (this.spuId) {
              if (window.page_source === 3) {
                LX.mv({
                  bid: 'b_shangou_online_e_xe7mbypq_mv',
                  val: {
                    spu_id: this.spuId,
                    st_spu_id: this.product.spId || 0,
                    viewtime: (Date.now() - this.startTime) / 1000,
                    page_source: window.page_source,
                    task_id: (window.page_source_param && window.page_source_param.task_id)
                  }
                })
                bid = 'b_shangou_online_e_xe7mbypq_mv'
              } else {
                LX.mv({
                  bid: 'b_shangou_online_e_61xp3hvd_mv',
                  val: {
                    spu_id: this.spu_id || response.id || 0,
                    list: getProductChangInfo(this.product, this.originalFormData),
                    select_time: +new Date(response && response.serverTime ? response.serverTime : Date.now()).getTime()
                  }
                })
                bid = 'b_shangou_online_e_61xp3hvd_mv'
              }
            } else {
              LX.mv({
                bid: 'b_shangou_online_e_aifq7sdx_mv',
                val: {
                  // 后端数据绝对准确的情况下，无兜底逻辑
                  // spu_id: response.id || this.spuId || 0,
                  spu_id: response.id,
                  source_id: 0,
                  st_spu_id: this.product.spId || 0,
                  viewtime: `${SearchTime.getSearchTime() + FillTime.getFillTime()}, ${SearchTime.getSearchTime()}, ${FillTime.getFillTime()}`,
                  list: TimeCounters.getResult(),
                  trace_id: response.traceId,
                  select_time: +new Date(response && response.serverTime ? response.serverTime : Date.now()).getTime()
                }
              })
              bid = 'b_shangou_online_e_aifq7sdx_mv'
            }
            window.Owl.addError({ name: 'saveError', msg: `callback内：product:${JSON.stringify(this.product)}, response: ${JSON.stringify(response)}, page_source: ${window.page_source}, bid: ${bid}` }, { level: 'warn' })
            LXContext.destroyVm()
            this.popConfirmModal(response)
          }
          callback()
        }, this)
        if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
          this.$emit('on-revocation', this.productInfo, cb)
        } else {
          this.$emit('on-submit', this.productInfo, wholeContext, cb, { noMessage: true })
        }
      },
      pageLeave () {
        if (!this.spuId) {
          LX.mc({
            cid: 'c_4s0z2t6p',
            bid: 'b_shangou_online_e_7cxe0v96_mc',
            val: {
              list: getProductChangInfo(this.product),
              op_type: this.product.spId ? 1 : 0
            }
          })
        }
      }
    },
    beforeDestroy () {
      this.pageLeave()
      LXContext.destroyVm()
    },
    mounted () {
      this.createTime = +new Date()
      FillTime.fillStartTime = +new Date()
      this.startTime = Date.now()
      window.addEventListener('beforeunload', this.pageLeave)
    },
    created () {
      LXContext.setVm(this)
    }
  }
</script>
