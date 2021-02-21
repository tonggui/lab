import BatchPages from './batch-management/router'
import { PLATFORM } from '@/data/enums/common'

export default [
  {
    name: 'medicineRegisterList',
    path: 'product/list',
    component: () => import(
      /* webpackChunkName: "medicine-register-list" */ './product/index.js'
    )
  },
  {
    /* 任务进度 */
    name: 'medicineRegisterBatchProgress',
    path: 'progress',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-progress" */ '../progress-new/index.vue'
      ),
    meta: {
      platform: PLATFORM.MEDICINE_REGISTER,
      pv: { cid: '' },
      title: '任务进度'
    }
  },
  {
    /* 批量管理 */
    path: 'batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-batch-management" */ './batch-management/index.vue'
      ),
    children: BatchPages
  },
  {
    /* 药品购买信息下载 */
    path: 'download',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-download" */ './download/index.vue'
      )
  }
]
