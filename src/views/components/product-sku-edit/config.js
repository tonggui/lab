// import { validate } from '@sgfe/product-validate'
import { isNumber } from 'lodash'
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
      const regx = /^(-?[1-9]\d*|0)$/
      if (!value && !isNumber(value)) {
        return '库存不能为空'
      }
      if (!regx.test(value) || value < -1) {
        return '大于-1的整数（-1为无限）'
      }
      if (value > 999) {
        return '最大限制999'
      }
      // if (value < 0 && value )
      // const res = validate('sku.stock', value)
      // if (res.code > 0) {
      //   return res.msg
      // }
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
      const regx = /^([1-9]\d*|0)(\.\d{0,2})?$/
      if (!value) {
        return '价格不能为空'
      }
      if (!regx.test(value)) {
        return '大于0的数字，最多2位小数'
      }
      if (value >= 30000) {
        return '最大限制30000'
      }
      // const res = validate('sku.price', value)
      // if (res.code > 0) {
      //   return res.msg
      // }
    },
    onChange: (value, sku) => ({ price: { ...sku.price, value } }),
    editComponent: {
      inline: EditPriceInline,
      confirm: EditPriceConfirm
    }
  }
}
