import { validate } from '@sgfe/product-validate'
import EditStock from './edit/stock'
import EditPrice from './edit/price'
import ProductStock from '@components/product-stock'
import ProductPrice from '@components/product-price'

export const FELID = {
  STOCK: 1,
  PRICE: 2
}

export default {
  [FELID.STOCK]: {
    title: '修改库存',
    headerTitle: '库存',
    validator: (value) => {
      const res = validate('sku.stock', value)
      if (res.code > 0) {
        return res.msg
      }
    },
    displayRender: (h, { skuList }) => {
      const stockList = skuList.map(sku => sku.stock)
      return <ProductStock stock={stockList} />
    },
    editRender: (h, { sku, onChange }) => {
      const value = sku.stock
      return h(EditStock, {
        attrs: {
          value,
          onConfirm: onChange
        }
      })
    }
  },
  [FELID.PRICE]: {
    title: '修改价格',
    headerTitle: '价格',
    validator: (value) => {
      const res = validate('sku.price', value)
      if (res.code > 0) {
        return res.msg
      }
    },
    displayRender: (h, { skuList }) => {
      const priceList = skuList.map(sku => sku.price.value)
      return <ProductPrice price={priceList} />
    },
    editRender: (h, { sku, onChange }) => {
      const value = (sku.price || {}).value
      return h(EditPrice, {
        attrs: {
          value,
          onConfirm: onChange
        }
      })
    }
  }
}
