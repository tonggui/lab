import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export const tabList = [{
  id: 'all-not-pass',
  name: '全量未审核通过商品',
  count: 0,
  statusList: [
    PRODUCT_AUDIT_STATUS.ALL_NOT_PASS
  ],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 0 }
  }
}, {
  id: 'all',
  name: '我的全部商品',
  count: 0,
  statusList: [
    PRODUCT_AUDIT_STATUS.SP_UNAUDIT,
    PRODUCT_AUDIT_STATUS.AUDITING,
    PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
    PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
    PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION
  ],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 1 }
  }
}, {
  id: 'auditing',
  name: '我的审核中',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDITING],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 2 }
  }
}, {
  id: 'reject',
  name: '我的审核驳回',
  needDanger: true,
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 3 }
  }
}, {
  id: 'approve',
  name: '我的审核通过',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 4 }
  }
}, {
  id: 'revocation',
  name: '我的审核撤销',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 5 }
  }
}, {
  id: 'draft',
  name: '我的草稿',
  count: 0,
  statusList: [PRODUCT_AUDIT_STATUS.SP_UNAUDIT],
  statistics: {
    bid: 'b_shangou_online_e_5zng3oy3_mc',
    val: { type: 6 }
  }
}]

export const defaultActiveTab = 'all-not-pass'
