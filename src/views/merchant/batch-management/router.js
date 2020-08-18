import { KEYS } from './menus'
import { PLATFORM } from '@/data/enums/common'

const getProps = (route) => {
  return { routerTagId: route.query.routerTagId }
}

export default [{
  name: KEYS.CREATE,
  path: 'batchCreate',
  component: () => import(
    /* webpackChunkName: "merchant-batch-management-batch-create" */ './batch-create/index.vue'
  ),
  props: getProps,
  meta: {
    platform: PLATFORM.MERCHANT,
    title: '批量新建商品',
    pv: {
      cid: 'c_fd6n21x7'
    }
  }
}, {
  name: KEYS.MODIFY,
  path: 'batchModify',
  component: () => import(
    /* webpackChunkName: "merchant-batch-management-batch-modify" */ './batch-modify/index.vue'
  ),
  props: getProps,
  meta: {
    platform: PLATFORM.MERCHANT,
    title: '批量修改商品',
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}, {
  name: KEYS.REL,
  path: 'batchRel',
  component: () => import(
    /* webpackChunkName: "merchant-batch-management-batch-rel" */ './batch-rel/index.vue'
  ),
  props: getProps,
  meta: {
    platform: PLATFORM.MERCHANT,
    title: '批量关联商品',
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}, {
  name: KEYS.UPLOAD_IMAGE,
  path: 'batchUploadImages',
  component: () => import(
    /* webpackChunkName: "merchant-batch-management-batch-uploadImages" */ './batch-uploadImages/index.vue'
  ),
  props: getProps,
  meta: {
    platform: PLATFORM.MERCHANT,
    title: '批量传图商品',
    pv: {
      cid: 'c_kuxi3tol'
    }
  }
}]
