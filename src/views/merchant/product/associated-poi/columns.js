import Price from '@/views/merchant/components/price-cell'

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
    key: 'price',
    width: 200,
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
    align: 'left',
    width: 200,
    render: (h, { row }) => {
      return <span style={{ paddingLeft: '80px' }}>{ row.sellStatus === 1 ? '已下架' : '已上架' }</span>
    },
    renderHeader: (h, { column }) => {
      return <span style={{ paddingLeft: '80px' }}>{ column.title }</span>
    }
  }
]
