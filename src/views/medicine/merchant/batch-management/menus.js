
import { isPlainObject, merge } from 'lodash'
// import BatchSync from '@sgfe/eproduct/navigator/pages/batch/sync'

export const KEYS = {
  MEDICINE_CREATE: 'merchantMedicineBatchCreate',
  MEDICINE_MODIFY: 'merchantMedicineBatchModify',
  MEDICINE_REL: 'merchantMedicineBatchRel',
  MEDICINE_PROGRESS: 'merchantMedicineBatchProgress',
  MEDICINE_SYNC: 'batchSync'
}

const path = '/medicine/merchant'

export const LINKS = {
  MEDICINE_CREATE: `${path}/batchManagement/batchCreate`,
  MEDICINE_MODIFY: `${path}/batchManagement/batchModify`,
  MEDICINE_REL: `${path}/batchManagement/batchRel`,
  MEDICINE_SYNC: `${path}/batchManagement/batchSync`,
  MEDICINE_PROGRESS: `${path}/progress`
}

const menuList = [
  {
    name: '新增商品中心商品',
    key: KEYS.MEDICINE_CREATE,
    link: {
      name: KEYS.MEDICINE_CREATE
    }
  },
  {
    name: '批量修改商品',
    key: KEYS.MEDICINE_MODIFY,
    link: {
      name: KEYS.MEDICINE_MODIFY
    }
  },
  {
    name: '批量关联商品',
    key: KEYS.MEDICINE_REL,
    link: {
      name: KEYS.MEDICINE_REL
    }
  },
  {
    name: '批量同步商品',
    key: KEYS.MEDICINE_SYNC,
    link: {
      name: KEYS.MEDICINE_SYNC
    }
  }
  // {
  //   name: '批量同步商品',
  //   key: KEYS.MEDICINE_SYNC,
  //   link: {
  //     name: BatchSync.name
  //   }
  // }
]

export function filterMenu (list = [], moduleMap = {}) {
  return list.map((item) => {
    const moduleItem = moduleMap[item.key]
    if (isPlainObject(moduleItem)) {
      return merge({}, item, moduleItem)
    }
    return item
  })
}

export default (modules = {}) => {
  const list = menuList.filter(menu => {
    return modules[menu.key] !== false
  })
  return filterMenu(list)
}
