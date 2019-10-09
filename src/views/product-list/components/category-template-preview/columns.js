
import ProductInfo from '@components/product-table-info'

export default [{
  title: '商品信息',
  minWidth: 200,
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  maxWidth: 180,
  minWidth: 120,
  key: 'price',
  align: 'right',
  render: (h, { row }) => {
    return h('span', [row.priceStr])
  }
}, {
  title: '库存',
  maxWidth: 180,
  minWidth: 120,
  key: 'stock',
  align: 'right'
}]
