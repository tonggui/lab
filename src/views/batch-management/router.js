import { KEYS } from './menus'

export default [{
  name: KEYS.CREATE,
  path: 'batchCreate',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-create" */ './batch-create/index.vue'
  )
}]
