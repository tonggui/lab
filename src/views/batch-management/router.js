import { KEYS } from './menus'
import { getIsSinglePoi } from './helper'

const getProps = (route) => {
  const isSinglePoi = getIsSinglePoi(route.query)
  return { isSinglePoi, routerTagId: route.query.routerTagId }
}

export default [{
  name: KEYS.CREATE,
  path: 'batchCreate',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-create" */ './batch-create/index.vue'
  ),
  props: getProps
}, {
  name: KEYS.MODIFY,
  path: 'batchModify',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-modify" */ './batch-modify/index.vue'
  ),
  props: getProps
}, {
  name: KEYS.DELETE,
  path: 'batchDelete',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-delete" */ './batch-delete/index.vue'
  ),
  props: getProps
}]
