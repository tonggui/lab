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
  props: getProps,
  meta: {
    title: '批量新建商品',
    cid: [{
      id: 'c_fd6n21x7',
      match: query => !getIsSinglePoi(query)
    }, {
      id: 'c_0sr1aw3x',
      match: query => getIsSinglePoi(query)
    }]
  }
}, {
  name: KEYS.MODIFY,
  path: 'batchModify',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-modify" */ './batch-modify/index.vue'
  ),
  props: getProps,
  meta: {
    title: '批量修改商品',
    cid: [{
      id: 'c_kuxi3tol',
      match: query => !getIsSinglePoi(query)
    }, {
      id: 'c_0sr1aw3x',
      match: query => getIsSinglePoi(query)
    }]
  }
}, {
  name: KEYS.DELETE,
  path: 'batchDelete',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-delete" */ './batch-delete/index.vue'
  ),
  props: getProps,
  meta: {
    title: '批量删除',
    cid: [{
      id: 'c_l9hz249g',
      match: query => !getIsSinglePoi(query)
    }, {
      id: 'c_74vfrfdr',
      match: query => getIsSinglePoi(query)
    }]
  }
}]
