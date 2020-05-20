export default [
  {
    /* 商品搜索列表页面 */
    name: 'productRecommend',
    path: '/product/recommend',
    component: () =>
      import(
        /* webpackChunkName: "product-recommend" */ '@/views/product-recommend/index'
      ),
    meta: {
      // cid: 'c_cqpzfm6x',
      // categoryAuth: true
    }
  }
]
