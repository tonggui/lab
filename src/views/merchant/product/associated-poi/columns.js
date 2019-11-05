import ProductPrice from '@components/product-price'
import ProductStock from '@components/product-stock'
import { PRODUCT_SELL_STATUS } from '@/data/enums/product'

export default [
  {
    title: '门店ID',
    key: 'poiId',
    align: 'left',
    width: 150
  }, {
    title: '门店信息',
    key: 'name',
    align: 'left',
    minWidth: 100
  }, {
    title: '价格',
    key: 'priceRange',
    width: 200,
    align: 'right',
    render: (h, { row }) => {
      return h(ProductPrice, { props: { price: row.priceRange } })
    }
  }, {
    title: '库存',
    key: 'stock',
    width: 150,
    align: 'right',
    render: (h, { row }) => {
      return h(ProductStock, { props: { stock: row.stock } })
    }
  }, {
    title: '状态',
    key: 'sellStatus',
    align: 'left',
    width: 200,
    render: (h, { row }) => {
      return (
        <span style={{ paddingLeft: '80px' }}>
          { row.sellStatus === PRODUCT_SELL_STATUS.OFF && '已下架' }
          { row.sellStatus === PRODUCT_SELL_STATUS.ON && '已上架' }
          { row.sellStatus === undefined && '--' }
        </span>
      )
    },
    renderHeader: (h, { column }) => {
      return <span style={{ paddingLeft: '80px' }}>{ column.title }</span>
    }
  }
]
