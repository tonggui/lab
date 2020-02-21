import MerchantPages from '@/views/merchant/router'
import MerchantView from '@/views/merchant'
import MedicinePages from '@/views/medicine/router'
import MedicineView from '@/views/medicine'
import BatchPages from '@/views/batch-management/router'
import ProductSettingView from '@/views/product-setting'
import ProductSettingPages from '@/views/product-setting/router'
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
      cid: 'c_o6mvsbt8',
      categoryAuth: true
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
      cid: 'c_cqpzfm6x',
      categoryAuth: true
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
      }],
      categoryAuth: true
    }
  },
  {
    /* 视频中心 */
    name: 'videoCenter',
    path: '/product/videoCenter',
    component: () =>
      import(
        /* webpackChunkName: "video-center" */ '../views/video-center/index.vue'
      ),
    meta: {
      categoryAuth: true
    }
  },
  {
    /* 回收站页面 */
    name: 'recycle',
    path: '/product/recycle',
    component: () =>
      import(
        /* webpackChunkName: "recycle" */ '../views/recycle/index.vue'
      ),
    meta: {
      categoryAuth: true
    }
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
    /* 商品设置页面 -- 包含缺货库存自动清零页面 */
    name: 'productSetting',
    path: '/product/setting',
    component: ProductSettingView,
    children: ProductSettingPages
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
    /* 药品 */
    path: '/medicine',
    component: MedicineView,
    children: MedicinePages
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
    name: 'error',
    path: '/error',
    component: () =>
      import(
        /* webpackChunkName: "errorPage" */ '../views/error/index.vue'
      )
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
