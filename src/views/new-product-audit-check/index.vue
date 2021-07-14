<template>
  <div class="product-audit-check">
    <div class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Form
        navigation
        ref="form"
        v-model="productInfo"
        :disabled="formDisable || !havePermission"
        :context="context"
        @validate-error="handleValidateError"
        @cancel="handleCancel"
        @confirm="handleConfirm"
        @confirm-click="handleConfirmClick"
      >
        <template slot="footer">
          <Button style="min-width: 120px" @click="handleCancel" :disabled="submitting">取消</Button>
          <PermissionBtn :btn-type="btnType" need-permission style="min-width: 120px" type="primary" :loading="submitting" @click="handleRevocation" v-if="isAuditing">撤销</PermissionBtn>
          <PermissionBtn :btn-type="btnType" need-permission style="min-width: 120px" type="primary" :loading="submitting" @click="triggerConfirm" v-else>{{ auditBtnText }}</PermissionBtn>
        </template>
      </Form>
    </div>
    <AuditProcessList
      ref="process"
      :product="productInfo"
      :show="showProcessList"
    />
  </div>
</template>
<script>
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { WARNING_TIP } from './constants'
  import AuditProcessList from './audit-process-list'
  import Form from './form'
  import lx from '@/common/lx/lxReport'
  import errorHandler from '@/views/edit-page-common/error'
  import { get } from 'lodash'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { diffKeyAttrs } from '@/common/product/audit'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  export default {
    name: 'product-audit-check',
    mixins: [getPermissionMixin('EDIT')],
    props: {
      isBusinessClient: Boolean,
      product: Object,
      spId: [Number, String],
      spuId: [Number, String],
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean,
      usedBusinessTemplate: Boolean,
      upcIsSp: Boolean,
      upcIsAuditPassProduct: Boolean
    },
    data () {
      return {
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {}, // xxx快照?
        submitting: false,
        needPermission: true
      }
    },
    computed: {
      productInfo: {
        get () {
          return this.product
        },
        set (product) {
          this.$emit('change', product)
        }
      },
      isAuditing () {
        return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      },
      auditStatus () {
        return this.productInfo.auditStatus
      },
      auditBtnStatus () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
          return 'REVOCATION'
        }
        return this.needAudit ? 'RESUBMIT' : 'SAVE'
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      warningTip () {
        return WARNING_TIP[this.productInfo.auditStatus] || ''
      },
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.auditStatus)
      },
      context () {
        return {
          field: {
            [SPU_FIELD.TAG_LIST]: {
              required: !this.usedBusinessTemplate
            },
            [SPU_FIELD.UPC_CODE]: {
              disabled: this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING,
              visible: !!(this.originalFormData.id && this.originalFormData.upcCode)
            },
            [SPU_FIELD.UPC_IMAGE]: {
              required: this.upcIsSp,
              disabled: !this.upcIsSp && this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING,
              visible: !this.upcIsSp && ((this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING && !!this.productInfo.upcImage) || this.needAudit) && !this.upcIsAuditPassProduct
            }
          },
          features: {
            navigation: true,
            spuId: this.spuId,
            showCellularTopSale: true,
            audit: {
              originalProduct: this.originalFormData,
              approveSnapshot: this.productInfo.approveSnapshot,
              needCorrectionAudit: this.isNeedCorrectionAudit,
              snapshot: this.productInfo.snapshot,
              productSource: this.productInfo.productSource
            },
            allowSuggestCategory: this.allowSuggestCategory // 根据审核变化
          }
        }
      },
      formDisable () {
        return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      },
      // 是否展示审核步骤
      showProcessList () {
        const list = this.productInfo.taskList || []
        return list.length > 0
      },
      // 编辑场景下是否需要审核
      editNeedAudit () {
        if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
          return this.isNeedCorrectionAudit
        } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }
        return false
      },
      needAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        const auditStatus = this.auditStatus
        // 审核详情查看页面，均需要走审核逻辑（除非是审核中，走撤销逻辑）
        if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回状态下，如果UPC不存在且选中类目为需审核类目，需要审核，其他为可保存
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
            return this.categoryNeedAudit
          }
          // 审核撤销状态下，必须送审
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION) {
            return true
          }
          return this.isNeedCorrectionAudit
        }

        return this.editNeedAudit
      },
      isNeedCorrectionAudit () {
        if (!this.poiNeedAudit) return false // 门店审核状态
        const auditStatus = this.auditStatus

        // 审核详情页面，审核通过走编辑场景的逻辑
        if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回，只允许重新提审，且提审后一直都是审核纠错状态
          return auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        }
        return this.checkCateNeedAudit()
      },
      // TODO 表单是否需要校验
      isNeedFormValidate () {
        const auditStatus = this.auditStatus
        // 审核撤销场景，不需要表单校验
        return auditStatus !== PRODUCT_AUDIT_STATUS.AUDITING
      }
    },
    components: {
      AuditProcessList,
      Form
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
      createModal (resolve, reject) {
        let tip = '注：选择"撤销"后，新建的商品会被删除，在售商品可重新提审'
        switch (this.productInfo.triggerMode) {
        case AuditTriggerMode.CREATE:
          tip = '注：该商品是新建商品，若选择"撤销"会删除商品'
          break
        case AuditTriggerMode.MODIFY:
          tip = '撤销后可重新提交审核'
          break
        default: break
        }
        const $modal = this.$Modal.open({
          title: '撤销商品审核',
          content: `撤销【${this.productInfo.name}】的信息审核。<br><br>${tip}`,
          centerLayout: true,
          iconType: '',
          width: 412,
          closable: true,
          renderFooter: () => (
              <div>
              <Button onClick={async () => {
            try {
              resolve(true)
              $modal.destroy()
            } catch (err) {
              this.$Message.error(err.message)
              throw err
            }
          }}>撤销</Button>
          <Button type="primary" onClick={() => {
            $modal.destroy()
            // TODO 页面跳转地址
            this.$router.replace({ name: 'productAuditCheckEdit', query: { ...this.$route.query, spuId: this.productInfo.id } })
          }}>修改商品</Button>
          </div>
        )
        })
      },
      async handleRevocation () {
        try {
          // 撤销审核的点击埋点
          lx.mc({
            bid: 'b_shangou_online_e_2410gzln_mc',
            val: { spu_id: this.spuId }
          })
          const needRevocation = await new Promise((resolve, reject) => {
            this.createModal(resolve, reject)
          })
          if (needRevocation) {
            this.submitting = true
            this.$emit('on-revocation', this.productInfo, () => {
              this.submitting = false
              this.handleCancel() // 返回
            })
          }
        } catch (err) {
          this.$Message.error(err.message)
          this.submitting = false
        }
      },
      handleConfirmClick () {
        const isRecommendTag = (this.productInfo.tagList || []).some(tag => !!tag.isRecommend)
        lx.mc({
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
      handleValidateError (error) {
        const spChangeInfoDecision = this.getSpChangeInfoDecision()
        lx.mc({
          bid: 'b_a3y3v6ek',
          val: {
            spu_id: this.spuId,
            op_type: spChangeInfoDecision,
            op_res: 0,
            fail_reason: `前端校验失败：${error || ''}`
          }
        })
      },
      async handleConfirm (callback = () => {}, context = {}) {
        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.needAudit,
          showLimitSale,
          ...this.$refs.form.form.getPluginContext()
        }
        this.submitting = true
        this.$emit('on-submit', this.productInfo, wholeContext, (response, err) => {
          this.submitting = false
          const spChangeInfoDecision = this.getSpChangeInfoDecision()
          if (err) {
            lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0, page_source: 0 } })
            errorHandler(err)({
              isBusinessClient: this.isBusinessClient,
              confirm: this.handleConfirm
            })
            return
          }
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0, page_source: 0 } })
          this.handleCancel() // 返回
        })
      },
      triggerConfirm () {
        if (this.needAudit) {
          // 点击重新提交审核埋点
          lx.mc({
            bid: 'b_shangou_online_e_3ebesqok_mc',
            val: { spu_id: this.spuId }
          })
        }
        this.$refs['form'].handleConfirm()
      },
      handleCancel () {
        this.$emit('on-cancel')
      }
    }
  }
</script>
<style lang="less" scoped>
.product-audit-check {
  display: flex;
  width: 100%;
  .form-container {
    width: 100%;
    &.with-task-list {
      width: 75%;
    }
  }
}
</style>
