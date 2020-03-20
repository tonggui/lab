import BatchDelete from '@sgfe/eproduct/navigator/pages/batch/delete'
import BatchModify from '@sgfe/eproduct/navigator/pages/batch/modify'
import BatchSync from '@sgfe/eproduct/navigator/pages/batch/sync'
import BatchUploadImage from '@sgfe/eproduct/navigator/pages/batch/uploadImgs'

export const KEYS = {
  CREATE: 'batchCreate',
  MODIFY: 'batchModify',
  DELETE: 'batchDelete',
  UPLOAD_IMAGE: 'batchUploadImage',
  SYNC: 'batchSync'
}

const menuList = [{
  name: '批量新建商品',
  key: KEYS.CREATE,
  link: {
    path: '/batchManagement/batchCreate'
  }
}, {
  name: '批量上传图片',
  key: KEYS.UPLOAD_IMAGE,
  link: {
    name: BatchUploadImage.name
  }
}, {
  name: '批量修改商品',
  key: KEYS.MODIFY,
  link: {
    name: BatchModify.name
  }
}, {
  name: '批量同步商品',
  key: KEYS.SYNC,
  link: {
    name: BatchSync.name
  }
}, {
  name: '批量删除',
  key: KEYS.DELETE,
  link: {
    name: BatchDelete.name
  }
}]

export default (modules) => {
  return menuList.filter(menu => {
    return modules[menu.key] !== false
  })
}
