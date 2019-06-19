import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: [
    {
      name: 'productList',
      path: '/product/list',
      component: () =>
        import(
          /* webpackChunkName: "product-list" */ './views/product-list/index.vue'
        )
    },
    {
      name: 'recycle',
      path: '/product/recycle',
      component: () =>
        import('./views/recycle/index.vue')
    },
    {
      path: '/',
      redirect: { name: 'productList' }
    }
  ]
})
