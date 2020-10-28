import { validate } from '@sgfe/product-validate'
// import { Message } from '@roo-design/roo-vue'

export default {
  'MOD_STOCK': {
    title: '修改库存',
    headerTitle: '库存',
    validator: (value) => {
      const res = validate('sku.stock', value)
      if (res.code > 0) {
        return res.msg
      }
    }
  },
  'MOD_PRICE': {
    title: '修改价格',
    headerTitle: '价格',
    validator: (value) => {
      const res = validate('sku.price', value)
      if (res.code > 0) {
        return res.msg
      }
    }

  }
}
