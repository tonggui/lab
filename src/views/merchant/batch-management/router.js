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
      cid: 'c_shangou_online_e_ujuxqb7l'
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
      cid: 'c_shangou_online_e_lj8ez0kp'
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
      cid: 'c_shangou_online_e_xwdtokjl'
    }
  }
}, {
  name: KEYS.MEDICINE_REL,
  path: 'medicineBatchRel',
  component: () => import(
    /* webpackChunkName: "merchant-medicine-batch-management-batch-rel" */ './batch-rel/medicine-batch-rel.vue'
  ),
  props: getProps,
  meta: {
    platform: PLATFORM.MERCHANT,
    title: '批量关联商品',
    pv: {
      cid: 'c_shangou_online_e_xwdtokjl'
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
      cid: 'c_shangou_online_e_28r250qo'
    }
  }
}]
