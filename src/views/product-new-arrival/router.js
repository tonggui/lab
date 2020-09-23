export default [{
  path: 'list',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-list" */ './pages/product-newArrival-list/index'
      ),
  meta: {
    // TODO
    title: '新店必建',
    pv: { cid: 'c_shangou_online_e_xmfqale0', type: 'productCube' }
  }
}]
