<template>
  <div class="product-audit-check">
    <div class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <PoiSelect v-model="poiIdList" :disabled="isAuditing" />
      <Form
        ref="form"
        navigation
        v-model="productInfo"
        :is-edit-mode="isEditMode"
        :disabled="formDisable"
        :context="context"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template slot="footer">
          <Button style="min-width: 120px" @click="handleCancel" :disabled="submitting">取消</Button>
          <Button style="min-width: 120px" type="primary" :loading="submitting" @click="handleRevocation" v-if="isAuditing">撤销</Button>
          <Button style="min-width: 120px" type="primary" :loading="submitting" @click="triggerConfirm" v-else>{{ auditBtnText }}</Button>
        </template>
      </Form>
    </div>
    <AuditProcessList
      :product="productInfo"
      v-if="showProcessList"
    />
  </div>
</template>
<script>
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { WARNING_TIP } from './constants'
  import AuditProcessList from './audit-process-list'
  import Form from './form'
  import { diffKeyAttrs } from '@/common/product/audit'
  import lx from '@/common/lx/lxReport'
  import errorHandler from '@/views/edit-page-common/error'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { get, isString } from 'lodash'
  import PoiSelect from '@/views/merchant/components/poi-select'

  export default {
    name: 'product-audit-check',
    props: {
      isBusinessClient: Boolean,
      product: Object,
      spId: Number,
      spuId: Number,
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean,
      upcIsSp: Boolean,
      upcIsAuditPassProduct: Boolean
    },
    data () {
      return {
        submitting: false,
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {} // xxx快照?
      }
    },
    computed: {
      poiIdList: {
        get () {
          return this.product.poiIds || []
        },
        set (poiIdList) {
          this.$emit('change', { ...this.product, poiIds: poiIdList })
        }
      },
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
        const tip = WARNING_TIP[this.product.auditStatus] || ''
        if (isString(tip)) {
          return tip
        }
        return tip[this.product.auditType] || ''
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
            // 商家商品中心，固定不支持，写死
            [SPU_FIELD.PRODUCT_VIDEO]: {
              visible: false
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
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            allowAddSpec: true,
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
        return this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
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

        const auditStatus = this.productInfo.auditStatus
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
        const auditStatus = this.productInfo.auditStatus

        // 审核详情页面，审核通过走编辑场景的逻辑
        if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回，只允许重新提审，且提审后一直都是审核纠错状态
          return auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        }
        return this.checkCateNeedAudit()
      },
      // TODO 表单是否需要校验
      isNeedFormValidate () {
        const auditStatus = this.productInfo.auditStatus
        // 审核撤销场景，不需要表单校验
        return auditStatus !== PRODUCT_AUDIT_STATUS.AUDITING
      }
    },
    components: {
      AuditProcessList,
      Form,
      PoiSelect
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const oldData = this.originalFormData
          const newData = this.productInfo
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
          onCancel: () => resolve(false),
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
          <Button type="primary"onClick={() => {
            $modal.destroy()
            // TODO 页面跳转地址
            this.$router.replace({ name: 'merchantAuditCheckEdit', query: { ...this.$route.query, spuId: this.productInfo.id } })
          }}>修改商品</Button>
          </div>
        )
        })
      },
      handleCancel () {
        this.$emit('on-cancel')
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
      handleConfirm (callback = () => {}, context = {}) {
        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.needAudit,
          ...this.$refs.form.form.getPluginContext(),
          showLimitSale
        }
        this.submitting = true
        this.$emit('on-submit', this.productInfo, wholeContext, (response, err) => {
          this.submitting = false
          if (err) {
            errorHandler(err)({
              isBusinessClient: this.isBusinessClient,
              confirm: this.handleConfirm
            })
            return
          }
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
