
import { isPlainObject, merge } from 'lodash'
export const KEYS = {
  MEDICINE_REGISTER_MODIFY: 'medicineRegisterBatchModify',
  MEDICINE_REGISTER_CREATE: 'medicineRegisterBatchCreate',
  MEDICINE_REGISTER_PROGRESS: 'medicineRegisterBatchProgress'
}

const path = '/medicine/register'

export const LINKS = {
  MEDICINE_REGISTER_MODIFY: `${path}/batchManagement/batchModify`,
  MEDICINE_REGISTER_CREATE: `${path}/batchManagement/batchCreate`,
  MEDICINE_REGISTER_PROGRESS: `${path}/progress`
}

const menuList = [
  {
    name: '批量更新配置',
    key: KEYS.MEDICINE_REGISTER_MODIFY,
    link: {
      name: KEYS.MEDICINE_REGISTER_MODIFY
    }
  },
  {
    name: '批量新建配置',
    key: KEYS.MEDICINE_REGISTER_CREATE,
    link: {
      name: KEYS.MEDICINE_REGISTER_CREATE
    }
  }
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
