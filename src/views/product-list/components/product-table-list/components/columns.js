
import ProductInfo from '@components/product-table-info'
import ProductOperation from './product-operation'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  width: 150,
  key: 'priceStr'
}, {
  title: '库存',
  width: 150,
  key: 'stock'
}, {
  title: '操作',
  width: 150,
  render: (h, { row }) => {
    return h(ProductOperation, { props: { product: row } })
  }
}]
