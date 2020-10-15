import { PLATFORM } from '@/data/enums/common'
// import { KEYS } from './batch-management/menus'

export default [
  // {
  //   path: 'product/edit',
  //   name: 'merchantEdit',
  //   component: () => import(
  //     /* webpackChunkName: "merchant-product-edit" */ './product/product-edit/index.js'
  //   ),
  //   meta: {
  //     pv: {
  //       cid: [{
  //         id: 'c_shangou_online_e_l2fn53ks', // 编辑
  //         match: obj => obj.spuId
  //       }, {
  //         id: 'c_shangou_online_e_0jqze6bd', // 新建
  //         match: obj => !obj.spuId
  //       }]
  //     },
  //     title: '商品管理'
  //   }
  // },
  {
    path: 'product/list',
    name: 'multiStoreProductList',
    component: () => import(
      /* webpackChunkName: "multi-store-product-list" */ './product/list/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_036oyg8f' },
      title: '门店商品管理'
    }
  },
  {
    /* 多门店管理 任务进度 */
    // name: KEYS.PROGRESS,
    name: 'multiStoreProgress',
    path: '/progress',
    component: () =>
      import(
        /* webpackChunkName: "multi-store-progress" */ '../progress-new/index.vue'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      pv: { cid: 'c_shangou_online_e_5ygjvh03' },
      title: '任务进度'
    }
  }
]
