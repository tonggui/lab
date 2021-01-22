import {
  spAuditDetail,
  commitAuditSp,
  saveOrUpdateSpInfo,
  cancelAuditSp,
  getAuditSpList,
  submitDeleteSpAudit,
  getAuditSpSearchSuggestion
} from '../api/medicineSpAudit'

import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import { Pagination } from '@/data/interface/common'
import { MedicineAuditStandardProduct } from '@/data/interface/product'

export {
  isAuditApplyEnabled
} from '../api/medicineSpAudit'

export const fetchSpAuditDetailInfo = (poiId: string, spId: number) => spAuditDetail({ poiId, spId })

export const saveOrUpdate = (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return saveOrUpdateSpInfo({ poiId, spId, product })
}

export const commitAudit = (poiId: string, spId: number, product: MedicineAuditStandardProduct) => {
  return commitAuditSp({ poiId, spId, product })
}

export const cancelAudit = (spId: number, poiId: string) => cancelAuditSp({ poiId, spId })

export const fetchSubmitDeleteSpAudit = (spId: number, poiId: number) => submitDeleteSpAudit({ spId, poiId })

export const fetchGetAuditSpList = (filter: {
  auditStatus: PRODUCT_AUDIT_STATUS[],
  searchWord: string
}, pagination: Pagination, poiId: number) => getAuditSpList({
  pagination,
  poiId,
  ...filter
})

// export const fetchGetAuditSpSearchSuggestion = (keyword: string, auditStatus: PRODUCT_AUDIT_STATUS[], poiId: number) => getAuditSpSearchSuggestion({
//   keyword,
//   poiId,
//   auditStatus: [
//     PRODUCT_AUDIT_STATUS.SP_UNAUDIT,
//     PRODUCT_AUDIT_STATUS.AUDITING,
//     PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
//     PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
//     PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
//   ]
// })

export const fetchGetAuditSpSearchSuggestion = (keyword: string, poiId: number, auditStatus: PRODUCT_AUDIT_STATUS[]) => {
  // 这里是和之前逻辑保持一致，查全部结果，不是只查当前状态的结果
  const isAllNotPass = auditStatus.indexOf(PRODUCT_AUDIT_STATUS.ALL_NOT_PASS) > -1
  return getAuditSpSearchSuggestion({
    keyword,
    poiId,
    auditStatus: isAllNotPass ? [
      PRODUCT_AUDIT_STATUS.ALL_NOT_PASS,
      PRODUCT_AUDIT_STATUS.SP_UNAUDIT,
      PRODUCT_AUDIT_STATUS.AUDITING,
      PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
    ] : [
      PRODUCT_AUDIT_STATUS.SP_UNAUDIT,
      PRODUCT_AUDIT_STATUS.AUDITING,
      PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED
    ]
  })
}
