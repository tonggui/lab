
import ProductInfo from './components/product-info'
import ProductOperation from './components/product-operation'

export default [{
  type: 'selection',
  width: 60,
  align: 'center'
}, {
  title: '商品信息',
  render: (h) => {
    return h(ProductInfo)
  }
}, {
  title: '价格',
  key: 'priceStr'
}, {
  title: '库存',
  key: 'stock'
}, {
  title: '操作',
  render: (h) => {
    return h(ProductOperation)
  }
}]
