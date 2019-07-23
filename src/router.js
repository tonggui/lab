import Vue from 'vue'
import Router from 'vue-router'
import MerchantPages from './views/merchant/router'
import MerchantView from './views/merchant'
import { PLATFORM } from '@/data/enums/common'

Vue.use(Router)

const demofiles = require.context('./', true, /demo\.vue$/)
// console.dir(demofiles);
// console.log(demofiles.keys());
// console.log(demofiles(demofiles.keys()[0]));

const router = new Router({
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
      name: 'merchantProgress',
      path: '/merchant/progress',
      component: () => import(/* webpackChunkName: "merchant_progress" */ './views/progress/index.vue'),
      meta: {
        platform: PLATFORM.MERCHANT
      }
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

router.beforeEach((to, from, next) => {
  /* must call `next` */
  if (to.meta) {
    // 设置cid TODO 兼容性
    document.title = to.meta.title || '商品管理'
    let $cid = document.querySelector('meta[name="lx:cid"]')
    if (!$cid) {
      $cid = document.createElement('meta')
      $cid.setAttribute('name', 'lx:cid')
      document.querySelector('head').appendChild($cid)
    }
    $cid.setAttribute('content', to.meta.cid)
    console.log('aaa')
  }
  next()
})

export default router
