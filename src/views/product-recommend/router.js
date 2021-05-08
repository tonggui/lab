export default [{
  path: 'list',
  name: 'recommendList',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-list" */ './pages/product-recommend-list/index'
    ),
  meta: {
    title: '新店必建',
    pv: { cid: 'c_shangou_online_e_xmfqale0', type: 'productCube' }
  }
}, {
  path: 'edit',
  name: 'recommendEdit',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-edit" */ './pages/product-recommend-edit/index'
    ),
  meta: {
    title: '完善商品信息',
    pv: { cid: 'c_shangou_online_e_yeqv8a20', type: 'productCube' }
  }
}]
