import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

export default {
  [PRODUCT_AUDIT_STATUS.AUDITING]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品（注：审核中的商品删除后无法从回收站中恢复）',
    bid: ''
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: {
    content: '确定删除该商品？删除后不可售卖，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: ''
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: {
    content: '确定删除该商品？删除后不可售卖，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: ''
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: ''
  },
  [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: {
    content: '确定删除该商品？删除后，如需再次售卖请重新创建该商品或在[商品列表>回收站]中恢复',
    bid: ''
  }
}
