import { KEYS } from './menus'

const getProps = (route) => {
  return { routerTagId: route.query.routerTagId }
}
export default [
  {
    name: KEYS.MEDICINE_REGISTER_MODIFY,
    path: 'batchModify',
    component: () => import(
      /* webpackChunkName: "medicine-register-batch-management-modify" */ '@/views/medicine-register/batch-management/batch-modify/index.vue'
    ),
    props: getProps
  },
  {
    name: KEYS.MEDICINE_REGISTER_CREATE,
    path: 'batchCreate',
    component: () => import(
    /* webpackChunkName: "merchant-batch-management-batch-create" */ '@/views/medicine-register/batch-management/batch-create/index.vue'
  ),
    props: getProps
  }
]
