export default [{
  path: 'list',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-list" */ './pages/product-recommend-list/index'
    )
}, {
  path: 'edit',
  component: () =>
    import(
      /* webpackChunkName: "product-recommend-edit" */ './pages/product-recommend-edit/index'
    )
}]
