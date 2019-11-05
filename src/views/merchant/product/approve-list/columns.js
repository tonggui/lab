
import ProductInfo from '@components/product-table-info'
import ProductPrice from '@components/product-price'

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
  key: 'priceRange',
  align: 'right',
  render: (h, { row }) => {
    return h(ProductPrice, { props: { price: row.priceRange } })
  }
}, {
  title: '关联门店数',
  width: 150,
  key: 'poiCount',
  align: 'right'
}, {
  title: '上报时间',
  width: 200,
  key: 'ctime',
  align: 'left',
  renderHeader: (h, { column }) => {
    return <span style={{ paddingLeft: '60px' }}>{ column.title }</span>
  },
  render: (h, { row }) => {
    return <span style={{ paddingLeft: '60px' }}>{ row.ctime }</span>
  }
}]
