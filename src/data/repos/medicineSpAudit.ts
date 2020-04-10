import {
  spAuditDetail,
  commitAuditSp,
  saveOrUpdateSpInfo,
  cancelAuditSp
} from '../api/medicineSpAudit'

import { MedicineAuditStandardProduct } from '@/data/interface/product'

export {
  isAuditApplyEnabled
} from '../api/medicineSpAudit'

export const fetchSpAuditDetailInfo = (poiId: string, spId: number) => spAuditDetail({ poiId, spId })

export const saveOrUpdate = async (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return saveOrUpdateSpInfo({ poiId, spId, product })
}

export const commitAudit = async (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return commitAuditSp({ poiId, spId, product })
}

export const cancelAudit = async (spId: number) => {
  return cancelAuditSp({ spId })
}
