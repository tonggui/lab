import { getCubeTaskStatus } from '@/data/repos/merchantCube'
import { BATCH_REL_TASK_STATUS } from '@/data/enums/batch'

export default [
  {
    name: 'merchantCubeList',
    path: 'list',
    components: {
      default: () => import(
        /* webpackChunkName: "merchant-cube-list" */ './pages/list'
        ),
      breadCrumb: () => import(
        /* webpackChunkName: "cube-breadcrumb-center" */ './components/cube-breadcrumb-center'
        )
    },
    meta: {
      id: 'merchantCubeList',
      title: '选择商品',
      pv: {
        cid: ''
      }
    },
    beforeEnter: async (to, from, next) => {
      const { id, status } = await getCubeTaskStatus()
      if (id < 0) next()
      else if ([BATCH_REL_TASK_STATUS.IN_PROCESS, BATCH_REL_TASK_STATUS.INLINE].includes(status)) {
        next({ name: 'merchantCubeProcessStatus' })
      } else {
        next({ name: 'merchantCubeProcessResult' })
      }
    }
  },
  {
    name: 'merchantCubeEdit',
    path: 'edit',
    components: {
      default: () => import(
        /* webpackChunkName: "merchant-cube-edit" */ './pages/edit'
        ),
      breadCrumb: () => import(
        /* webpackChunkName: "cube-breadcrumb-back" */ './components/cube-breadcrumb-back'
        )
    },
    meta: {
      id: 'merchantCubeEdit',
      title: '完善商品信息',
      pv: {
        cid: ''
      }
    }
  },
  {
    name: 'merchantCubeProcessStatus',
    path: 'status',
    components: {
      default: () => import(
        /* webpackChunkName: "merchant-cube-list" */ './pages/status'
        ),
      breadCrumb: () => import(
        /* webpackChunkName: "cube-breadcrumb-center" */ './components/cube-breadcrumb-center'
      )
    },
    meta: {
      id: 'merchantCubeProcessStatus',
      title: '创建中',
      pv: {
        cid: ''
      }
    }
  },
  {
    name: 'merchantCubeProcessResult',
    path: 'result',
    components: {
      default: () => import(
        /* webpackChunkName: "merchant-cube-list" */ './pages/result'
        ),
      breadCrumb: () => import(
        /* webpackChunkName: "cube-breadcrumb-center" */ './components/cube-breadcrumb-center'
        )
    },
    meta: {
      id: 'merchantCubeProcessResult',
      title: '创建结果',
      pv: {
        cid: ''
      }
    }
  }
]
