import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export const tabList = [{
  id: PRODUCT_AUDIT_STATUS.ALL,
  name: '全部商品',
  count: 0
}, {
  id: PRODUCT_AUDIT_STATUS.AUDITING,
  name: '审核中',
  count: 0
}, {
  id: PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
  name: '审核驳回',
  needDanger: true,
  count: 0
}, {
  id: PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
  name: '审核通过',
  count: 0
}, {
  id: PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
  name: '审核撤销',
  count: 0
}]

export const defaultActiveTab = PRODUCT_AUDIT_STATUS.ALL
