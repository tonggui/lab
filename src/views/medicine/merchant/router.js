import { PLATFORM } from '@/data/enums/common'
import { KEYS } from './batch-management/menus'
import BatchPages from './batch-management/router'

export default [
  {
    path: 'product/list',
    name: 'medicineMerchantList',
    component: () => import(
      /* webpackChunkName: "merchant-medicine-product-list" */ './product/list/index.js'
    ),
    meta: {
      pv: { cid: '' },
      title: '列表页'
    }
  },
  {
    path: 'product/edit',
    name: 'medicineMerchantEdit',
    component: () => import(
      /* webpackChunkName: "merchant-medicine-product-edit" */ './product/product-edit/index.js'
    ),
    meta: {
      pv: {
        cid: [{
          id: '', // 编辑
          match: obj => obj.spuId
        }, {
          id: '', // 新建
          match: obj => !obj.spuId
        }]
      },
      title: '商品管理'
    }
  },
  {
    path: 'product/searchList',
    name: 'medicineMerchantSearchList',
    component: () => import(
      /* webpackChunkName: "merchant-medicine-product-searchList" */ './product/search-list/index.js'
    ),
    meta: {
      pv: { cid: '' },
      title: '搜索列表页'
    }
  },
  {
    /* 商家商品库中心 任务进度 */
    name: KEYS.MEDICINE_PROGRESS,
    path: 'progress',
    component: () =>
      import(
        /* webpackChunkName: "merchant_progress" */ '../../progress-new/index.vue'
      ),
    meta: {
      platform: PLATFORM.MEDICINE_MERCHANT,
      pv: { cid: '' },
      title: '任务进度'
    }
  },
  {
    /* 批量管理 */
    path: 'batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "merchant-medicine-batch-management" */ './batch-management/index.vue'
      ),
    children: BatchPages
  },
  {
    path: 'product/relPoi',
    name: 'medicineMerchantRelPoi',
    component: () => import(
      /* webpackChunkName: "merchant-product-list-poi" */ './product/associated-poi/index.js'
    ),
    meta: {
      pv: { cid: '' },
      title: '商品关联门店列表'
    }
  }
]
