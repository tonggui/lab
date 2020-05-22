import _ from 'lodash'
import { AuditFieldTipType } from './constants'
import { AUDIT_PRODUCT_SOURCE } from '@/data/enums/product'
import { EDIT_TYPE } from '@/data/enums/common'
export default (ctx, keyPath, filter) => {
  const isManager = ctx.getContext('modules').isManager
  const editType = ctx.getContext('modules').editType
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
  }

  // 非运营场景下的提示信息
  if (!isManager) {
    if (isNeedCorrectionAudit) {
      tips.push({
        type: AuditFieldTipType.MERCHANT_CHANGE,
        value: currentValue,
        ref: _.get(originalFormData, keyPath)
      })
    }
    // 只有商家查看审核商品信息的场景下，才需要显示审核人的修改提示
    if ([EDIT_TYPE.CHECK_AUDIT, EDIT_TYPE.AUDITING_MODIFY_AUDIT].includes(editType)) {
      tips.push({
        type: AuditFieldTipType.AUDITOR_CHANGE,
        value: _.get(originalFormData, keyPath),
        ref: _.get(approveSnapshot, keyPath),
        tester ({ value, ref }, formatter, next) {
          // 显示审核人修改提示的前提是当前值与初始值相同，如果用户修改过，则无需再显示
          if (formatter(currentValue) === formatter(value)) {
            return !_.isEqualWith(value, ref, (v1, v2) => {
              if (_.isObject(v1) || _.isObject(v2)) return !next()
              if (_.isArray(v1) || _.isArray(v2)) return _.isEqual(v1, v2) || !next()
              else return _.isEqual(v1, v2)
            })
          }
          return false
        }
      })
    }
  }

  if (filter) {
    return tips.filter(filter)
  }

  return tips
}
