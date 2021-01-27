import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export default {
  [PRODUCT_AUDIT_STATUS.AUDITING]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品（注：审核中的商品删除后无法从回收站中恢复）',
    bid: 'b_shangou_online_e_8zggt8r2_mc'
  },
  [PRODUCT_AUDIT_STATUS.START_SELL_AUDITING]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品（注：审核中的商品删除后无法从回收站中恢复）',
    bid: 'b_shangou_online_e_8zggt8r2_mc'
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: {
    content: '确定删除该商品？删除后不可售卖，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: 'b_shangou_online_e_y8mru73e_mc'
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: {
    content: '确定删除该商品？删除后不可售卖，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: 'b_shangou_online_e_2sv79id0_mc'
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: 'b_shangou_online_e_qbwg8zwh_mc'
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: 'b_shangou_online_e_qbwg8zwh_mc'
  }
}
