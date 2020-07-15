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
    pv: {
      cid: [
        {
          id: 'c_fd6n21x7', // 跨店
          match: obj => obj.from !== 'single'
        }, {
          id: 'c_0sr1aw3x', // 单店
          match: obj => obj.from === 'single'
        }
      ]
    }
  }
}]
