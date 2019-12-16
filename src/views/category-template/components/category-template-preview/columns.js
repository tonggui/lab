
import ProductInfo from '@components/product-table-info'
import ProductPrice from '@components/product-price'
import ProductStock from '@components/product-stock'

export default [{
  title: '商品信息',
  minWidth: 200,
  maxWidth: 260,
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  maxWidth: 100,
  minWidth: 80,
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
  title: '库存',
  maxWidth: 100,
  minWidth: 80,
  key: 'stock',
  align: 'right',
  render: (h, { row }) => {
    return h(ProductStock, {
      props: {
        stock: row.skuList.map(sku => sku.stock)
      }
    })
  }
}]
