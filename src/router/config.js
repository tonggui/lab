// TODO demo 页面环境隔离
import MerchantPages from '@/views/merchant/router'
import MerchantView from '@/views/merchant'
import {
  PLATFORM
} from '@/data/enums/common'

const demoFileList = require.context('./', true, /demo\.vue$/)

const routeList = [
  {
    /* 商品列表页面 */
    name: 'productList',
    path: '/product/list',
    component: () =>
      import(
        /* webpackChunkName: "product-list" */ '../views/product-list/index'
      )
  },
  {
    /* 商品搜索列表页面 */
    name: 'productSearchList',
    path: '/product/searchList',
    component: () =>
      import(
        /* webpackChunkName: "product-searchList" */ '../views/search-list/index'
      )
  },
  {
    /* 视频中心 */
    name: 'video-center',
    path: '/product/videoCenter',
    component: () =>
      import(
        /* webpackChunkName: "video-center" */ '../views/video-center/index.vue'
      )
  },
  {
    /* 回收站页面 */
    name: 'recycle',
    path: '/product/recycle',
    component: () =>
      import(
        /* webpackChunkName: "recycle" */ '../views/recycle/index.vue'
      )
  },
  {
    /* 处理进度页面 */
    name: 'progress',
    path: '/batchManagement/progress',
    component: () =>
      import(
        /* webpackChunkName: "progress" */ '../views/progress/index.vue'
      ),
    meta: {
      platform: PLATFORM.PRODUCT,
      title: '任务进度'
    }
  },
  {
    /* 动态表单 测试页面 */
    name: 'dynamic-form',
    path: '/product/dynamic-form',
    component: () =>
      import(
        /* webpackChunkName: "progress" */ '../views/dynamic-form/index.vue'
      )
  },
  {
    path: '/',
    redirect: { name: 'productList' }
  },
  {
    /* 商家商品库中心 */
    path: '/merchant',
    component: MerchantView,
    children: MerchantPages
  },
  {
    /* 商家商品库中心 任务进度 */
    name: 'merchantProgress',
    path: '/merchant/progress',
    component: () =>
      import(
        /* webpackChunkName: "merchant_progress" */ '../views/progress/index.vue'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      cid: 'c_shangou_online_e_5ygjvh03',
      title: '任务进度'
    }
  },
  {
    /* demo页面 */
    path: '/demo',
    component: () =>
      import(
        /* webpackChunkName: "demo" */ '../views/demo/index.vue'
      ),
    children: demoFileList.keys().map(key => ({
      name: demoFileList(key).default.name,
      path: demoFileList(key).default.name,
      component: demoFileList(key).default
    }))
  }
]

export default routeList
