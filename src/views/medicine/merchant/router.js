import { PLATFORM } from '@/data/enums/common'
import { KEYS } from '@/views/merchant/batch-management/menus'

export default [
  {
    path: 'product/list',
    name: 'medicineMerchantList',
    component: () => import(
      /* webpackChunkName: "merchant-product-list" */ './product/list/index.js'
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
      /* webpackChunkName: "merchant-product-edit" */ './product/product-edit/index.js'
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
    /* 商家商品库中心 任务进度 */
    name: KEYS.PROGRESS,
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
  }
]
