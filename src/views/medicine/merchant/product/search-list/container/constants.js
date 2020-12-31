import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [{
  name: '上架',
  id: PRODUCT_BATCH_OP.PUT_ON,
  tip: {
    success: '批量上架成功～',
    error: '批量上架失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 1
    }
  }
}, {
  name: '下架',
  id: PRODUCT_BATCH_OP.PUT_OFF,
  tip: {
    success: '批量下架成功～',
    error: '批量下架失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 2
    }
  }
}, {
  name: '修改分类',
  id: PRODUCT_BATCH_OP.MOD_TAG,
  tip: {
    success: '批量修改分类成功～',
    error: '批量修改分类失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 4
    }
  }
}]
