import BatchSync from '@sgfe/eproduct/navigator/pages/batch/sync'

export const KEYS = {
  CREATE: 'merchantBatchCreate',
  MODIFY: 'merchantBatchModify',
  UPLOAD_IMAGE: 'merchantBatchUploadImage',
  REL: 'merchantBatchRel',
  PROGRESS: 'merchantBatchProgress',
  SYNC: 'batchSync'
}

const menuList = [{
  name: '批量新建商品',
  key: KEYS.CREATE,
  link: {
    name: KEYS.CREATE
  }
}, {
  name: '批量修改商品',
  key: KEYS.MODIFY,
  link: {
    name: KEYS.MODIFY
  }
}, {
  name: '批量关联商品',
  key: KEYS.REL,
  link: {
    name: KEYS.REL
  }
}, {
  name: '批量同步商品',
  key: KEYS.SYNC,
  link: {
    name: BatchSync.name
  }
}, {
  name: '批量上传图片',
  key: KEYS.UPLOAD_IMAGE,
  link: {
    name: KEYS.UPLOAD_IMAGE
  }
}]

export default (modules) => {
  return menuList.filter(menu => {
    return modules[menu.key] !== false
  })
}
