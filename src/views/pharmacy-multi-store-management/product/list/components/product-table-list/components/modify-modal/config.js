import { validate } from '@sgfe/product-validate'
import {
  BATCH_OPARATION_ENUM
} from '@/data/enums/multiStore'
// import { Message } from '@roo-design/roo-vue'

export default {
  [BATCH_OPARATION_ENUM.MOD_STOCK]: {
    title: '修改库存',
    headerTitle: '库存',
    validator: (value) => {
      const res = validate('sku.stock', value)
      if (res.code > 0) {
        return res.msg
      }
    }
  },
  [BATCH_OPARATION_ENUM.MOD_PRICE]: {
    title: '修改价格',
    headerTitle: '价格',
    validator: (value) => {
      const res = validate('sku.price', value)
      if (res.code > 0) {
        return res.msg
      }
    }
  },
  [BATCH_OPARATION_ENUM.PUT_ON]: {
    title: '批量上架'
  },
  [BATCH_OPARATION_ENUM.PUT_OFF]: {
    title: '批量下架'
  },
  [BATCH_OPARATION_ENUM.DELETE]: {
    title: '批量删除'
  }
}
