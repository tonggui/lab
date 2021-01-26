import BatchPages from './batch-management/router'

export default [
  {
    name: 'medicineRegisterList',
    path: 'product/list',
    component: () => import(
      /* webpackChunkName: "medicine-register-list" */ './product/index.js'
    )
  },
  {
    /* 单个新增 */
    name: 'medicineRegisterEdit',
    path: 'edit',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-edit" */ './components/register-edit/index.vue'
      )
  },
  {
    /* 任务进度 */
    name: 'medicineRegisterBatchProgress',
    path: 'progress',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-progress" */ '../progress-new/index.vue'
      )
  },
  {
    /* 批量管理 */
    path: 'batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-batch-management" */ './batch-management/index.vue'
      ),
    children: BatchPages
  }
]
