export default [
  {
    name: 'medicineRegisterList',
    path: 'product/list',
    component: () => import(
      /* webpackChunkName: "medicine-register-list" */ './product/index.js'
    )
  },
  {
    /* 多门店管理 任务进度 */
    name: 'medicineRegisterProgress',
    path: '/task/progress',
    component: () =>
      import(
        /* webpackChunkName: "medicine-register-progress" */ '../progress-new/index.vue'
      )
  }
]
