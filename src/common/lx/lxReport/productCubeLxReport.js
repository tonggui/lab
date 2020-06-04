import BaseLxReport from './baseLxReport'
import moduleControl from '@/module'
import { POI_AUDIT_INFO } from '@/module/moduleTypes'
import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'
import _merge from 'lodash/merge'

const statusMap = {
  [AUDIT_STATUS.NOT_AUDITED]: 0,
  [AUDIT_STATUS.NOT_ON_PROCESS]: 0,
  [AUDIT_STATUS.AUDITING]: -1,
  [AUDIT_STATUS.REJECTED]: 3,
  [AUDIT_STATUS.PASSED]: 1
}

export default class ProductCubeLxReport extends BaseLxReport {
  getValLab (val) {
    const baseVal = super.getValLab(val)
    const poiStatusInfo = moduleControl.getFelid(POI_AUDIT_INFO)
    const { status, businessDays } = poiStatusInfo

    return _merge({}, baseVal, { custom: {
      product_status: statusMap[status],
      open_days: businessDays
    } })
  }
}
