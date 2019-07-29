import Vue from 'vue'
import Router from 'vue-router'
import MerchantPages from './views/merchant/router'
import MerchantView from './views/merchant'
import { PLATFORM } from '@/data/enums/common'
import lx from '@/common/lx/lxReport'

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
        platform: PLATFORM.MERCHANT,
        cid: 'c_shangou_online_e_5ygjvh03',
        title: '任务进度'
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
let prevPath = ''
router.beforeEach((to, _from, next) => {
  /* must call `next` */
  if (to.meta) {
    console.log('aaaa', to.meta)
    // TODO 兼容性 设置cid
    document.title = to.meta.title || '商品管理'
    let $cid = document.querySelector('meta[name="lx:cid"]')
    if (!$cid) {
      $cid = document.createElement('meta')
      $cid.setAttribute('name', 'lx:cid')
      document.querySelector('head').appendChild($cid)
    }
    let cid = to.meta.cid || ''
    if (Array.isArray(cid)) {
      cid.some((c) => {
        if (c.match && c.match(to.query)) {
          cid = c.id
          return true
        }
        return false
      })
    }
    $cid.setAttribute('content', cid)
    if (cid && prevPath !== to.path) {
      lx.pv({ cid: cid })
    }
  }
  next()
})

export default router
