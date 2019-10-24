import { validate } from '@sgfe/product-validate'
import EditStock from './edit/stock'
import EditPrice from './edit/price'
import ProductStock from '@components/product-stock'
import ProductPrice from '@components/product-price'
import { createCallback } from '@/common/vuex'
import { Message } from '@roo-design/roo-vue'

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
    editRender: (h, { sku, onChange, disabled }) => {
      const value = sku.stock
      return h(EditStock, {
        attrs: {
          disabled,
          value,
          onConfirm: async (...rest) => {
            await new Promise((resolve, reject) => {
              onChange(...rest, createCallback(() => {
                Message.success('修改库存成功～')
                resolve()
              }, (err) => {
                Message.error(err.Message || '修改库存失败')
                resolve(false)
              }))
            })
          }
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
    editRender: (h, { sku, onChange, disabled }) => {
      const value = (sku.price || {}).value
      return h(EditPrice, {
        attrs: {
          disabled,
          value,
          onConfirm: async (...rest) => {
            await new Promise((resolve, reject) => {
              onChange(...rest, createCallback(() => {
                Message.success('修改价格成功～')
                resolve()
              }, (err) => {
                Message.error(err.Message || '修改价格失败')
                resolve(false)
              }))
            })
          }
        }
      })
    }
  }
}
