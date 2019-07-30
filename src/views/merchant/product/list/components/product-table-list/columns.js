
import ProductInfo from '@components/product-table-info'
import Price from '@/views/merchant/components/price-cell'
import AssociatedPoi from '@/views/merchant/components/associated-poi-cell'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  },
  align: 'left'
}, {
  title: '价格',
  width: 100,
  align: 'right',
  render: (h, { row }) => {
    return h(Price, [row.priceRange])
  }
}, {
  title: '关联门店数',
  width: 150,
  align: 'right',
  render: (h, { row }) => {
    return h(AssociatedPoi, { props: { id: row.id }, directives: [{ name: 'mc', value: { bid: 'b_shangou_online_e_t4mnknun_mc' } }] }, [row.poiCount])
  }
}]
