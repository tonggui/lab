<template>
  <div class="product-audit-check">
    <div class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Form
        navigation
        ref="form"
        v-model="productInfo"
        :disabled="formDisable"
        :context="context"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template slot="footer">
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleConfirm">{{ auditBtnText }}</Button>
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
  import { get, isFunction } from 'lodash'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import { keyAttrsDiff } from '@/views/edit-page-common/common'

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
      usedBusinessTemplate: Boolean
    },
    data () {
      return {
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {} // xxx快照?
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
              disabled: !!get(this.productInfo, 'skuList[0].upcCode') && this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING,
              visible: !!get(this.productInfo, 'skuList[0].upcCode') && ((this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING && !!this.productInfo.upcImage) || this.needAudit)
            }
          },
          features: {
            showCellularTopSale: true,
            audit: {
              originalProduct: this.originalFormData,
              approveSnapshot: this.productInfo.approveSnapshot,
              needCorrectionAudit: this.isNeedCorrectionAudit,
              snapshot: this.productInfo.snapshot,
              productSource: this.productInfo.productSource
            },
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
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
          return keyAttrsDiff(oldData, newData)
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
      async requestUserConfirm () {
        const id = this.productInfo.id || 0
        if (['RESUBMIT', 'SUBMIT'].includes(this.auditBtnStatus)) {
          // 点击重新提交审核/重新提交审核
          lx.mc({
            bid: 'b_shangou_online_e_3ebesqok_mc',
            val: { spu_id: id }
          })
        }
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
          // 撤销审核的点击
          lx.mc({
            bid: 'b_shangou_online_e_2410gzln_mc',
            val: { spu_id: id }
          })
          // TODO
          return new Promise((resolve, reject) => {
            this.createModal(resolve, reject)
          })
        }
        return true
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

        const cb = (response, err) => {
          if (err) {
            errorHandler(err)({
              isBusinessClient: this.isBusinessClient,
              confirm: this.handleConfirm
            })
          } else {
            this.handleCancel() // 返回
          }
          if (isFunction(callback)) callback()
        }
        if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
          if (await this.requestUserConfirm()) {
            this.$emit('on-revocation', this.productInfo, cb)
          }
        } else {
          const err = await this.$refs['form'].validate()
          if (err) {
            this.$Message.warning(err)
          } else {
            this.$emit('on-submit', this.productInfo, wholeContext, cb)
          }
        }
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
