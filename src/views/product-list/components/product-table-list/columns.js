
import ProductInfo from '@components/product-table-info'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  },
  align: 'left'
}, {
  title: '价格',
  width: 150,
  key: 'priceStr',
  align: 'right',
  sortable: true
}, {
  title: '库存',
  width: 150,
  key: 'stock',
  align: 'right'
}]
