export default [{
  type: 'selection',
  width: 60,
  align: 'center'
}, {
  title: '门店名称',
  key: 'name',
  align: 'center'
}, {
  title: '门店位置',
  key: 'address',
  align: 'center'
}, {
  title: '订阅次数',
  key: 'subscribeCount',
  width: 100,
  align: 'center'
}, {
  title: '订阅状态',
  render (h, { row }) {
    return h('div', [row.status ? '开启' : '关闭'])
  },
  width: 100,
  align: 'center'
}, {
  title: '操作',
  slot: 'operation',
  width: 200,
  align: 'center'
}]
