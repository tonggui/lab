import ProductInfo from '@components/product-table-info'
import ProductPrice from '@components/product-price'
import ProductStock from '@components/product-stock'

export default [{
  title: '商品信息',
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row } })
  }
}, {
  title: '价格',
  width: 250,
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
  width: 200,
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