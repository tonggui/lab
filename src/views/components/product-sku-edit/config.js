import { validate } from '@sgfe/product-validate'
import { SKU_EDIT_TYPE } from '@/data/enums/product'
import EditStockConfirm from './edit/confirm/stock'
import EditStockInline from './edit/inline/stock'
import EditPriceConfirm from './edit/confirm/price'
import EditPriceInline from './edit/inline/price'

export default {
  [SKU_EDIT_TYPE.STOCK]: {
    title: '修改库存',
    headerTitle: '库存',
    getValue: (sku) => sku.stock,
    validator: (value) => {
      const res = validate('sku.stock', value)
      if (res.code > 0) {
        return res.msg
      }
    },
    onChange: (value) => ({ stock: value }),
    editComponent: {
      inline: EditStockInline,
      confirm: EditStockConfirm
    }
  },
  [SKU_EDIT_TYPE.PRICE]: {
    title: '修改价格',
    headerTitle: '价格',
    getValue: (sku) => sku.price.value,
    validator: (value) => {
      const res = validate('sku.price', value)
      if (res.code > 0) {
        return res.msg
      }
    },
    onChange: (value, sku) => ({ price: { ...sku.price, value } }),
    editComponent: {
      inline: EditPriceInline,
      confirm: EditPriceConfirm
    }
  }
}
