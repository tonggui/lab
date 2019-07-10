/*
 * @description
 *   Please write the router script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-06-28)
 */
export default [
  {
    path: 'product/edit',
    component: () => import(
      /* webpackChunkName: "merchant-product-edit" */ './product/edit/index.vue'
    )
  },
  {
    path: 'product/list',
    component: () => import(
      /* webpackChunkName: "merchant-product-edit" */ './product/list/index.vue'
    )
  },
  {
    path: 'product/search/list',
    component: () => import(
      /* webpackChunkName: "merchant-product-edit" */ './product/search-list/index.vue'
    )
  },
  {
    path: 'product/list/include',
    component: () => import(
      /* webpackChunkName: "merchant-product-list-include" */ './product/include-list/index.vue'
    )
  }
]
