
import ProductInfo from '@components/product-table-info'
import ProductOperation from '@components/product-table-operation'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  },
  align: 'left'
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
  title: '操作',
  width: 150,
  align: 'center',
  render: (h, { row }) => {
    return h(ProductOperation, { props: { product: row } })
  }
}]
