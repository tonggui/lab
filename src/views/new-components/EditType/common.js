import AuditMixin from './Audit'
import AduitModifyAuditMixin from './AuditingModifyAudit'
import CheckAuditMixin from './CheckAudit'
import NormalMixin from './Normal'
import { EDIT_TYPE } from '@/data/enums/common'

export const getMixin = (editType) => {
  switch (editType) {
    case EDIT_TYPE.AUDIT:
      return AuditMixin
    case EDIT_TYPE.NORMAL:
      return NormalMixin
    case EDIT_TYPE.AUDITING_MODIFY_AUDIT:
      return AduitModifyAuditMixin
    case EDIT_TYPE.CHECK_AUDIT:
      return CheckAuditMixin
    default:
      return NormalMixin
  }
}
