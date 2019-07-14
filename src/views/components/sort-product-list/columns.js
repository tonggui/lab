
import ProductInfo from '@components/product-table-info'

export default [{
  title: '顺序',
  type: 'index',
  width: 50
}, {
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  },
  align: 'left'
}]
