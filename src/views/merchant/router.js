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
      /* webpackChunkName: "merchant-product-list" */ './product/edit/index.vue'
    )
  }
]
