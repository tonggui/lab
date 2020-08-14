/** 商家查看审核状态 **/

import { PRODUCT_AUDIT_STATUS, AuditTriggerMode } from '@/data/enums/product'
import { EDIT_TYPE } from '@/data/enums/common'

import lx from '@/common/lx/lxReport'

const CheckAuditMixin = {
  computed: {
    mode () {
      return EDIT_TYPE.CHECK_AUDIT
    },
    auditBtnText () {
      if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
        return 'REVOCATION'
      }
      return this.needAudit ? 'RESUBMIT' : 'SAVE'
    },
    // 是否展示告警提示
    showWarningTip () {
      return this.warningTip
    },
    // 是否为运营审核
    isManager () {
      return false
    },
    showShortCut () {
      const { id, upcCode } = this.productInfo
      // 审核场景下如果没有upcCode，需要隐藏快捷入口
      return !!(id && upcCode)
    },
    allowSuggestCategory () {
      return ![
        PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
        PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
        PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
      ].includes(this.productInfo.auditStatus)
    },
    showUpcImage () {
      return true
    },
    showAuditProcess () {
      return true
    },
    needCheckSpChangeInfo () {
      return false
    },
    needConfirmModal () {
      return false
    },
    // 编辑场景下是否需要审核
    editNeedAudit () {
      if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
        return this.isNeedCorrectionAudit
      } else if (!this.originalProductCategoryNeedAudit && this.formContext.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
        return true
      }
      return false
    },
    needAudit () {
      const supportAudit = this.formContext.modules.supportAudit
      if (!supportAudit) return false
      // 门店未开启审核功能，则不启用审核状态
      if (!this.formContext.poiNeedAudit) return false

      const auditStatus = this.productInfo.auditStatus
      // 审核详情查看页面，均需要走审核逻辑（除非是审核中，走撤销逻辑）
      if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
        // 审核驳回状态下，如果UPC不存在且选中类目为需审核类目，需要审核，其他为可保存
        if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
          return this.formContext.categoryNeedAudit
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
      if (!this.formContext.poiNeedAudit) return false // 门店审核状态
      const auditStatus = this.productInfo.auditStatus

      // 审核详情页面，审核通过走编辑场景的逻辑
      if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
        // 审核驳回，只允许重新提审，且提审后一直都是审核纠错状态
        if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED) {
          return true
        }
        return false
      }
      return this.checkCateNeedAudit()
    },
    // 表单是否需要校验
    isNeedFormValidate () {
      const auditStatus = this.productInfo.auditStatus
      // 审核撤销场景，不需要表单校验
      return auditStatus !== PRODUCT_AUDIT_STATUS.AUDITING
    }
  },
  methods: {
    createModal (resolve, reject) {
      let tip = '注：选择"撤销"后，新建的商品会被删除，在售商品可重新提审'
      switch (this.triggerMode) {
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
            <Button type="primary"onClick={() => {
              $modal.destroy()
              this.$router.replace({ name: 'productInfoAuditCheck', query: { ...this.$route.query, spuId: this.productInfo.id, modify: '1' } })
            }}>修改商品</Button>
          </div>
        )
      })
    },
    async requestUserConfirm () {
      const id = this.productInfo.id || 0
      if (['RESUBMIT', 'SUBMIT'].includes(this.auditBtnText)) {
        // 点击重新提交审核/重新提交审核
        lx.mc({
          bid: 'b_shangou_online_e_3ebesqok_mc',
          val: { spu_id: id }
        })
      }
      if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
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
    async handleConfirm () {
      if (await this.requestUserConfirm()) {
        await this.checkSuggestCategory()
        await this.handleSubmit()
      }
    }
  }
}

export default CheckAuditMixin
