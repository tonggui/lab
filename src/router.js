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
      name: 'video-center',
      path: '/product/videoCenter',
      component: () =>
        import(
          /* webpackChunkName: "video-center" */ './views/video-center/index.vue'
        )
    },
    {
      name: 'recycle',
      path: '/product/recycle',
      component: () =>
        import(
          /* webpackChunkName: "recycle" */ './views/recycle/index.vue'
        )
    },
    {
      name: 'progress',
      path: '/batchManagement/progress',
      component: () =>
        import(
          /* webpackChunkName: "progress" */ './views/progress/index.vue'
        )
    },
    {
      name: 'dynamic-form',
      path: '/product/dynamic-form',
      component: () =>
        import(
          /* webpackChunkName: "progress" */ './views/dynamic-form/index.vue'
        )
    },
    {
      path: '/',
      redirect: { name: 'productList' }
    }
  ]
})
