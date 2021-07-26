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
    displayRender: (h, { skuList, isSingleSku }) => {
      const stockList = skuList.map(sku => sku.stock)
      return <ProductStock stock={stockList} isSingleSku={isSingleSku} />
    },
    editRender: (h, { sku, onChange, disabled, isPackageProduct, isDisplayNone, isSingleSku, tabValue }) => {
      const value = sku.stock
      // TODO: 起购数
      const minOrderCount = sku.skuMinOrderCount
      return h(EditStock, {
        attrs: {
          displayNone: isDisplayNone,
          disabled: disabled || isPackageProduct,
          disableTip: isPackageProduct ? '组包商品库存根据组包内商品数量及商品库存自动计算，不能直接修改。如需修改，您可以找到组包内商品，修改关联商品的原库存' : '',
          value,
          minOrderCount,
          isSingleSku,
          tabValue, // 当前Tab值
          onConfirm: async (...rest) => {
            await new Promise((resolve, reject) => {
              onChange(...rest, createCallback(() => {
                Message.success('修改库存成功～')
                resolve()
              }, (err) => {
                Message.error(err.message || '修改库存失败')
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
    editRender: (h, { sku, onChange, disabled, isPackageProduct }) => {
      const value = (sku.price || {}).value
      return h(EditPrice, {
        attrs: {
          disabled: disabled || isPackageProduct,
          disableTip: isPackageProduct ? '组包商品价格根据组包内商品原价及组包优惠自动计算，不能直接修改。如需修改，您可以进入组包编辑页，调整组包内商品优惠幅度；或者，您在其他地方（如商家商品列表中）找到组包内关联的商品，修改相关商品的原价' : '',
          value,
          onConfirm: async (...rest) => {
            await new Promise((resolve, reject) => {
              onChange(...rest, createCallback(() => {
                Message.success('修改价格成功～')
                resolve()
              }, (err) => {
                Message.error(err.message || '修改价格失败')
                resolve(false)
              }))
            })
          }
        }
      })
    }
  }
}
