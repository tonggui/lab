import { PLATFORM } from '@/data/enums/common'
import { getCookie } from '@utiljs/cookie'

export default [
  {
    path: 'product/list',
    name: 'multiStoreProductList',
    component: () => import(
      /* webpackChunkName: "multi-store-product-list" */ './product/list/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_9cvs52p2', val: { acctId: getCookie('acctId') } },
      title: '门店商品管理'
    }
  },
  {
    /* 多门店管理 任务进度 */
    name: 'multiStoreProgress',
    path: '/task/progress',
    component: () =>
      import(
        /* webpackChunkName: "multi-store-progress" */ '../progress-new/index.vue'
      ),
    meta: {
      platform: PLATFORM.MULTI_STORE_MANAGEMENT,
      pv: { cid: 'c_shangou_online_e_5ygjvh03' },
      title: '任务进度'
    }
  }
]
