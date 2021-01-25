import {
  MEDICINE_REGISTER_PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [
  {
    name: '清除配置',
    id: MEDICINE_REGISTER_PRODUCT_BATCH_OP.CHANGE,
    tip: {
      success: '批量清除配置成功',
      error: '批量清除配置失败！'
    }
  }
]
