import MerchantPages from '@/views/merchant/router'
import MerchantView from '@/views/merchant'
import BatchPages from '@/views/batch-management/router'
import {
  PLATFORM
} from '@/data/enums/common'

const routeList = [
  {
    /* 商品列表页面 */
    name: 'productList',
    path: '/product/list',
    component: () =>
      import(
        /* webpackChunkName: "product-list" */ '../views/product-list/index'
      ),
    meta: {
      cid: 'c_o6mvsbt8'
    }
  },
  {
    /* 商品搜索列表页面 */
    name: 'productSearchList',
    path: '/product/searchList',
    component: () =>
      import(
        /* webpackChunkName: "product-search-list" */ '../views/search-list/index'
      ),
    meta: {
      cid: 'c_cqpzfm6x'
    }
  },
  {
    /* 商品新建编辑页面 */
    name: 'productEdit',
    path: '/product/edit',
    component: () =>
      import(
        /* webpackChunkName: "product-edit" */ '../views/product-edit/index'
      ),
    meta: {
      cid: [{
        id: 'c_qe4s221n',
        match: obj => obj.spuId
      }, {
        id: 'c_4s0z2t6p',
        match: obj => !obj.spuId
      }]
    }
  },
  {
    /* 视频中心 */
    name: 'videoCenter',
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
    path: '/',
    redirect: { name: 'productList' }
  },
  {
    /* 批量管理 */
    path: '/batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "batch-management" */ '../views/batch-management/index.vue'
      ),
    children: BatchPages
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
  }
]
// demo 页面环境隔离
if (process.env.NODE_ENV !== 'production') {
  const demoFileList = require.context('../', true, /demo\.vue$/)
  routeList.push({
    /* demo页面 */
    path: '/demo',
    component: () =>
      import(
        /* webpackChunkName: "demo" */ '../views/demo/index.vue'
      ),
    children: demoFileList.keys().filter(key => demoFileList(key).default.name).map(key => ({
      name: demoFileList(key).default.name,
      path: demoFileList(key).default.name,
      component: demoFileList(key).default
    }))
  })
}

export default routeList
