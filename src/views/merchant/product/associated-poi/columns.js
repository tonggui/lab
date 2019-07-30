import Price from '@/views/merchant/components/price-cell'

export default [
  {
    title: '门店ID',
    key: 'poiId',
    align: 'center',
    width: 100
  }, {
    title: '门店信息',
    key: 'name',
    align: 'center',
    width: 200
  }, {
    title: '价格',
    key: 'price',
    width: 150,
    align: 'right',
    render: (h, { row }) => {
      return h(Price, [row.price])
    }
  }, {
    title: '库存',
    key: 'stock',
    width: 150,
    align: 'right'
  }, {
    title: '状态',
    key: 'sellStatus',
    align: 'right',
    width: 150,
    render: (h, { row }) => {
      return h('span', [row.sellStatus === 1 ? '已下架' : '已上架'])
    }
  }
]
