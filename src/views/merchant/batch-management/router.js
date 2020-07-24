import { KEYS } from './menus'

const getProps = (route) => {
  return { routerTagId: route.query.routerTagId }
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
    pv: {
      cid: 'c_fd6n21x7'
    }
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
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}, {
  name: KEYS.REL,
  path: 'batchRel',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-modify" */ './batch-modify/index.vue'
  ),
  props: getProps,
  meta: {
    title: '批量修改商品',
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}, {
  name: KEYS.PROGRESS,
  path: 'batchModify',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-modify" */ './batch-modify/index.vue'
  ),
  props: getProps,
  meta: {
    title: '批量修改商品',
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}]
