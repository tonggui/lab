export default [{
  path: 'list',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-list" */ './pages/product-recommend-list/index'
    ),
  meta: {
    cid: 'c_shangou_online_e_xmfqale0'
  }
}, {
  path: 'edit',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-edit" */ './pages/product-recommend-edit/index'
    )
}]
