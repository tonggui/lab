
import ProductInfo from '@components/product-table-info'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  width: 100,
  key: 'priceRange',
  align: 'right'
}, {
  title: '关联门店数',
  width: 150,
  key: 'poiCount',
  align: 'right'
}, {
  title: '上报时间',
  width: 120,
  key: 'ctime',
  align: 'right'
}]
