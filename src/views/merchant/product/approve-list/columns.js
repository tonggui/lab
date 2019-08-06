
import ProductInfo from '@components/product-table-info'
import Price from '@/views/merchant/components/price-cell'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  width: 180,
  key: 'priceRange',
  align: 'right',
  render: (h, { row }) => {
    return h(Price, [row.priceRange])
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
