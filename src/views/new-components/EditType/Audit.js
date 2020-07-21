/** 运营查看 **/

import { EDIT_TYPE } from '@/data/enums/common'

const AuditMixin = {
  computed: {
    mode () {
      return EDIT_TYPE.AUDIT
    },
    auditBtnText () {},
    showWarningTip () {
      return false
    },
    // 是否为运营审核
    isManager () {
      return true
    },
    showShortCut () {
      const { id, upcCode } = this.productInfo
      // 审核场景下如果没有upcCode，需要隐藏快捷入口
      return !!(id && upcCode)
    },
    allowSuggestCategory () {
      return false
    },
    showUpcImage () {
      return true
    },
    showAuditProcess () {
      return false
    },
    needCheckSpChangeInfo () {
      return false
    },
    needConfirmModal () {
      return false
    },
    needAudit () {},
    isNeedCorrectionAudit () {},
    isNeedFormValidate () {}
  },
  methods: {
    handleConfirm () {}
  }
}

export default AuditMixin
