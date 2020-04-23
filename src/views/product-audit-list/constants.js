import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export const tabList = [{
  id: 'all',
  name: '全部商品',
  count: 0,
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 1 }
  }
}, {
  id: 'auditing',
  name: '审核中',
  count: 0,
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 2 }
  }
}, {
  id: 'reject',
  name: '审核驳回',
  needDanger: true,
  count: 0,
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 3 }
  }
}, {
  id: 'approve',
  name: '审核通过',
  count: 0,
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 4 }
  }
}, {
  id: 'revocation',
  name: '审核撤销',
  count: 0,
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 5 }
  }
}]

export const auditStatusMap = {
  all: [
    PRODUCT_AUDIT_STATUS.AUDITING,
    PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_APPROVED, PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
  ],
  auditing: [PRODUCT_AUDIT_STATUS.AUDITING],
  reject: [
    PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
  ], // 审核驳回包涵 审核驳回 + 纠错驳回
  approve: [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED],
  revocation: [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]
}

export const defaultActiveTab = 'all'

export const defaultAuditStatus = auditStatusMap[defaultActiveTab]
