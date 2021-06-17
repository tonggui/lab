import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [{
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
}, {
  name: '批量删除',
  id: PRODUCT_BATCH_OP.DELETE,
  tip: {
    success: '批量删除成功～',
    error: '批量删除失败！'
  },
  statistics: {
    bid: 'b_ripg0ips',
    custom: {
      type: 6
    }
  }
}]
