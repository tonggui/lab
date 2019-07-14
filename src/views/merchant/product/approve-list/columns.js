
import ProductInfo from '@components/product-table-info'
import Price from '@/views/merchant/components/price-cell'
import AssociatedPoi from '@/views/merchant/components/associated-poi-cell'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  width: 100,
  key: 'priceRange',
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
    return h(AssociatedPoi, { props: { spuId: row.id } }, [row.poiCount])
  }
}, {
  title: '上报时间',
  width: 150,
  key: 'ctime',
  align: 'right'
}]
