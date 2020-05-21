import _ from 'lodash'
import { AuditFieldTipType } from './constants'
import { AUDIT_PRODUCT_SOURCE } from '@/data/enums/product'
export default (ctx, keyPath, filter) => {
  const isManager = ctx.getContext('modules').isManager
  const isNeedCorrectionAudit = ctx.getContext('isNeedCorrectionAudit')
  const originalFormData = ctx.getContext('originalFormData') || {}
  const snapshot = ctx.getData('snapshot') || {}
  const approveSnapshot = ctx.getData('approveSnapshot') || {}
  const auditProductSource = ctx.getContext('productSource') || AUDIT_PRODUCT_SOURCE.UNKNOWN

  const currentValue = ctx.getData(keyPath)
  const tips = []
  // 运营审核模式下，并且只有为商家纠错场景，才会显示纠错前的标识信息
  if (isManager && auditProductSource === AUDIT_PRODUCT_SOURCE.BRAND_CORRECTION) {
    tips.push({
      type: AuditFieldTipType.MERCHANT_CORRECTION,
      value: currentValue,
      ref: _.get(snapshot, keyPath)
    })
  } else {
    if (isNeedCorrectionAudit) {
      tips.push({
        type: AuditFieldTipType.MERCHANT_CHANGE,
        value: currentValue,
        ref: _.get(originalFormData, keyPath)
      })
    }
    tips.push({
      type: AuditFieldTipType.AUDITOR_CHANGE,
      value: _.get(originalFormData, keyPath),
      ref: _.get(approveSnapshot, keyPath),
      tester (value, ref, formatter) {
        // 显示审核人修改提示的前提是当前值与初始值相同，如果用户修改过，则无需再显示
        return formatter(currentValue) === formatter(value)
      }
    })
  }

  if (filter) {
    return tips.filter(filter)
  }

  return tips
}
