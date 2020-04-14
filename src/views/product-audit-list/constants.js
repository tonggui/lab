import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export const tabList = [{
  id: 'all',
  name: '全部商品',
  count: 0,
  statusList: [
    PRODUCT_AUDIT_STATUS.AUDITING,
    PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
    PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
  ]
}, {
  id: 'auditing',
  name: '审核中',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDITING]
}, {
  id: 'reject',
  name: '审核驳回',
  needDanger: true,
  count: 0,
  statusList: [
    PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
  ]
}, {
  id: 'approve',
  name: '审核通过',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]
}, {
  id: 'revocation',
  name: '审核撤销',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]
}]

export const defaultActiveTab = 'all'
