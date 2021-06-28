import { PLATFORM } from '@/data/enums/common'

export default [
  {
    name: 'merchantCubeEdit',
    path: 'edit',
    component: () => import(
      /* webpackChunkName: "merchant-batch-management-batch-rel" */ './pages/edit'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      title: '',
      pv: {
        cid: ''
      }
    }
  },
  {
    name: 'merchantCubeList',
    path: 'list',
    component: () => import(
      /* webpackChunkName: "merchant-batch-management-batch-rel" */ './pages/list'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      title: '',
      pv: {
        cid: ''
      }
    }
  }
]
