import ProductInfo from '@components/product-table-info'
import ProductPrice from '@components/product-price'
import ProductStock from '@components/product-stock'
import { getRuleId } from '@/common/constants'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  // width: 120,
  key: 'price',
  align: 'right',
  render: (h, { row }) => {
    return h(ProductPrice, {
      props: {
        price: row.skuList.map(sku => sku.price.value)
      }
    })
  }
}, {
  title: '限购',
  // width: 350,
  key: 'stock',
  align: 'right',
  render: (h, { row }) => {
    return h(ProductStock, {
      props: {
        stock: (row.limitRuleId && row.limitRuleId + '' !== getRuleId()) ? `已在${row.limitRuleId}号规则中` : ''
      }
    })
  }
}]
