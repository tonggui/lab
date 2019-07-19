import Price from '@/views/merchant/components/price-cell'

export default [
  {
    title: '门店ID',
    key: 'id',
    align: 'center'
  }, {
    title: '门店信息',
    key: 'name'
  }, {
    title: '价格',
    key: 'price',
    width: 100,
    align: 'center',
    render: (h, { row }) => {
      return h(Price, [row.price])
    }
  }, {
    title: '库存',
    key: 'stock',
    width: 100,
    align: 'center'
  }, {
    title: '状态',
    key: 'sellStatus',
    render: (h, { row }) => {
      return h('span', [row.sellStatus === 1 ? '已下架' : '已上架'])
    }
  }
]
