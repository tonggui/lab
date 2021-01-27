import { KEYS } from './menus'

const getProps = (route) => {
  return { routerTagId: route.query.routerTagId }
}
export default [
  {
    name: KEYS.MEDICINE_REGISTER_MODIFY,
    path: 'batchSettings',
    component: () => import(
      /* webpackChunkName: "medicine-register-batch-management-modify" */ '@/views/medicine-register/batch-management/batch-settings/index.vue'
    ),
    props: getProps
  }
]
