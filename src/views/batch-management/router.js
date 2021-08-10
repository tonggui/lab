import { KEYS } from './menus'
import { getIsSinglePoi } from './helper'

const getProps = (route) => {
  const isSinglePoi = getIsSinglePoi(route.query)
  return { isSinglePoi, routerTagId: route.query.routerTagId }
}

export default [{
  name: KEYS.CREATE,
  path: 'batchCreate',
  components: {
    default: () =>
      import(
        /* webpackChunkName: "batch-management-batch-create" */ './batch-create/index.vue'
      ),
    gray: () =>
      import(
        /* webpackChunkName: "batch-management-batch-create" */ './batch-create/index.vue'
      )
  },
  props: {
    default: (...args) => {
      const props = getProps(...args)
      return { ...props, gray: false }
    },
    gray: (...args) => {
      const props = getProps(...args)
      return { ...props, gray: true }
    }
  },
  meta: {
    title: '批量新建商品',
    pv: {
      cid: [{
        id: 'c_fd6n21x7',
        match: query => !getIsSinglePoi(query)
      }, {
        id: 'c_0sr1aw3x',
        match: query => getIsSinglePoi(query)
      }]
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
      cid: [{
        id: 'c_kuxi3tol',
        match: query => !getIsSinglePoi(query)
      }, {
        id: 'c_86n2ym27',
        match: query => getIsSinglePoi(query)
      }]
    }
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
    pv: {
      cid: [{
        id: 'c_l9hz249g',
        match: query => !getIsSinglePoi(query)
      }, {
        id: 'c_74vfrfdr',
        match: query => getIsSinglePoi(query)
      }]
    }
  }
}, {
  name: KEYS.UPLOAD_IMAGE,
  path: 'batchUploadImg',
  component: () => import(
    /* webpackChunkName: "batch-management-batch-delete" */ './batch-upload-img/index.vue'
  ),
  props: getProps,
  meta: {
    title: '批量上传图片',
    pv: { cid: 'c_58bmqvy1' }
  }
}]