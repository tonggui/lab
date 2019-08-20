import ProductInfo from '@components/product-table-info'
import Price from '@/views/merchant/components/price-cell'
import AssociatedPoi from '@/views/merchant/components/associated-poi-cell'

export default [{
  title: '商品信息',
  minWidth: 200,
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  },
  align: 'left'
}, {
  title: '价格',
  maxWidth: 180,
  minWidth: 120,
  align: 'right',
  render: (h, { row }) => {
    return h(Price, [row.priceRange])
  }
}, {
  title: '关联门店数',
  width: 150,
  key: 'poiCount',
  align: 'right',
  render: (h, { row }) => {
    return h(AssociatedPoi, { props: { id: row.id } }, [row.poiCount])
  }
}]