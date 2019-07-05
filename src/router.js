import Vue from 'vue'
import Router from 'vue-router'
import MerchantPages from './views/merchant/router'
import MerchantView from './views/merchant'

Vue.use(Router)

const demofiles = require.context('./components', true, /demo\.vue$/)
// console.dir(demofiles);
// console.log(demofiles.keys());
// console.log(demofiles(demofiles.keys()[0]));

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
    },
    {
      path: '/merchant',
      component: MerchantView,
      children: MerchantPages
    },
    {
      path: '/demo',
      component: () =>
        import(/* webpackChunkName: "demo" */ './views/demo/index.vue'),
      children: demofiles.keys().map(key => ({
        name: demofiles(key).default.name,
        path: demofiles(key).default.name,
        component: demofiles(key).default
      }))
    }
  ]
})
