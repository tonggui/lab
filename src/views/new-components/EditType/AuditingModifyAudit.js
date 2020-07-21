/** 审核中商家编辑 **/

import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
// import { BUTTON_TEXT } from '../common'
import { EDIT_TYPE } from '@/data/enums/common'
import lx from '@/common/lx/lxReport'

const AduitModifyAuditMixin = {
  computed: {
    mode () {
      return EDIT_TYPE.AUDITING_MODIFY_AUDIT
    },
    auditBtnText () {
      return 'RESUBMIT'
    },
    showWarningTip () {
      return false
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
    needCheckSpChangeInfo () {
      return false
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
      return false
    },
    needConfirmModal () {
      return false
    },
    // 商家是否需要提交审核
    needAudit () {
      const supportAudit = this.formContext.modules.supportAudit
      if (!supportAudit) return false
      // 门店未开启审核功能，则不启用审核状态
      if (!this.formContext.poiNeedAudit) return false

      // 审核中商品如果是重新修改也需要走审核(此条件只有审核中存在)
      return true
    },
    // 是否为纠错审核
    isNeedCorrectionAudit () {
      if (!this.formContext.poiNeedAudit) return false // 门店审核状态
      return this.checkCateNeedAudit()
    },
    // 表单是否需要验证
    isNeedFormValidate () {
      return true
    }
  },
  methods: {
    async handleConfirm () {
      const id = this.productInfo.id || 0
      // 点击提交审核/重新提交审核
      lx.mc({
        bid: 'b_shangou_online_e_3ebesqok_mc',
        val: { spu_id: id }
      })
      await this.checkSuggestCategory()
      await this.handleSubmit()
    }
  }
}

export default AduitModifyAuditMixin
