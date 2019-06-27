// 批量处理的任务状态
export const STATUS = {
  DOING: 0,
  SUCCESS: 1,
  FAIL: 2
}

// 批量处理的任务状态的描述
export const STATUS_STR = {
  [STATUS.SUCCESS]: '已完成',
  [STATUS.FAIL]: '处理失败',
  [STATUS.DOING]: '处理中'
}

// 批量处理的逻辑处理的状态
export const RESULT = {
  SUCCESS: 1
}

// 批量操作的类型
export const TYPE = {
  CREATE: 1, // 批量新建商品
  UPDATE: 2, // 批量修改商品
  EXPORT: 3, // 批量导出商品
  DELETE: 4, // 批量删除商品
  SYNC: 5, // 批量同步商品
  // DOWNLOAD: 6, // 下载商品-列表页
  UPLOAD_IMGS: 7, // 批量上传图片
  UPDATE_BY_EXCEL: 8, // excel批量修改商品
  // CREATE_UNRELEASED_EXCEL: 9, // 创建中间态excel
  UPLOAD_UNRELEASED_EXCEL: 10, // 批量从商品库新建
  // CREATE_BY_TXT: 11, // 批量快捷新建
  BATCH_RELEASE_ONLY: 12, // 批量仅关联商品
  BATCH_RELEASE_REPLACE: 13, // 批量关联并替换商品
  // CREATE_UPDATED_EXCEL: 14, // 生成商品信息确认excel
  UPLOAD_UPDATED_EXCEL: 15 // 批量商品信息确认
  // SYNC_NEW: 20, // 新版跨店同步商品
}

// 批量处理的查看详情按钮的文案
export const TYPE_OPR_STR = {
  [TYPE.CREATE]: '查看商品列表',
  [TYPE.UPDATE]: '查看修改详情',
  [TYPE.EXPORT]: '查看导出详情',
  [TYPE.DELETE]: '查看删除详情',
  [TYPE.SYNC]: '查看同步详情',
  [TYPE.UPLOAD_IMGS]: '查看上传详情',
  [TYPE.UPDATE_BY_EXCEL]: '查看修改详情',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: '查看商品列表',
  [TYPE.BATCH_RELEASE_ONLY]: '查看仅关联详情',
  [TYPE.BATCH_RELEASE_REPLACE]: '查看关联并替换详情',
  [TYPE.UPLOAD_UPDATED_EXCEL]: '查看批量确认商品信息详情'
}

// 批量处理的查看详情按钮的action
export const DETAIL_ACTION = {
  [TYPE.CREATE]: 'LINK',
  [TYPE.UPDATE]: 'MODAL',
  [TYPE.EXPORT]: 'MODAL',
  [TYPE.DELETE]: 'MODAL',
  [TYPE.SYNC]: 'MODAL',
  [TYPE.UPLOAD_IMGS]: 'MODAL',
  [TYPE.UPDATE_BY_EXCEL]: 'LINK',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: 'LINK',
  [TYPE.BATCH_RELEASE_ONLY]: 'LINK',
  [TYPE.BATCH_RELEASE_REPLACE]: 'LINK',
  [TYPE.UPLOAD_UPDATED_EXCEL]: 'LINK'
}

// 批量处理的查看详情按钮的action_method
export const DETAIL_METHOD = {
  [TYPE.CREATE]: 'output',
  [TYPE.UPDATE]: {
    title: '批量修改详情',
    modalType: 'DETAIL_UPDATE'
  },
  [TYPE.EXPORT]: {
    title: '批量导出详情',
    modalType: 'DETAIL_COMMON'
  },
  [TYPE.DELETE]: {
    title: '批量删除详情',
    modalType: 'DETAIL_COMMON'
  },
  [TYPE.SYNC]: {
    title: '查看同步详情',
    modalType: 'DETAIL_COMMON'
  },
  [TYPE.UPLOAD_IMGS]: {
    title: '查看上传详情',
    modalType: 'DETAIL_UPLOAD_IMGS'
  },
  [TYPE.UPDATE_BY_EXCEL]: 'output',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: 'output',
  [TYPE.BATCH_RELEASE_ONLY]: 'output',
  [TYPE.BATCH_RELEASE_REPLACE]: 'output',
  [TYPE.UPLOAD_UPDATED_EXCEL]: 'output'
}

// 批量处理任务状态成功时 按钮文案：status === 1
export const STATUS_SUCCESS_RESULT = {
  [TYPE.CREATE]: '',
  [TYPE.UPDATE]: '',
  [TYPE.EXPORT]: '下载导出文件',
  [TYPE.DELETE]: '下载被删除商品',
  [TYPE.SYNC]: '',
  [TYPE.UPLOAD_IMGS]: '',
  [TYPE.UPDATE_BY_EXCEL]: '',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: '',
  [TYPE.BATCH_RELEASE_ONLY]: '',
  [TYPE.BATCH_RELEASE_REPLACE]: '',
  [TYPE.UPLOAD_UPDATED_EXCEL]: ''
}

// 批量处理任务状态失败时 按钮文案：status === 2
export const STATUS_FAIL_RESULT = {
  [TYPE.CREATE]: '',
  [TYPE.UPDATE]: '未匹配到任何商品',
  [TYPE.EXPORT]: '未匹配到任何商品',
  [TYPE.DELETE]: '未匹配到任何商品',
  [TYPE.SYNC]: '不需要同步任何商品',
  [TYPE.UPLOAD_IMGS]: '',
  [TYPE.UPDATE_BY_EXCEL]: '不需要同步任何商品',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: '',
  [TYPE.BATCH_RELEASE_ONLY]: '',
  [TYPE.BATCH_RELEASE_REPLACE]: '',
  [TYPE.UPLOAD_UPDATED_EXCEL]: ''
}

export const MUT_MODE = {
  'NAME': 1, // 商品名称
  'UPC': 2,
  'SKU': 3
}

export const MUT_MODE_STR = {
  [MUT_MODE.NAME]: '商品名称',
  [MUT_MODE.UPC]: 'UPC/EAN/条形码',
  [MUT_MODE.SKU]: 'SKU码/货号'
}

export const SELL_STATUS = {
  'SELLING': 0,
  'NOT_ON_SALE': 1
}

export const SELL_STATUS_STR = {
  [SELL_STATUS.SELLING]: '售卖中',
  [SELL_STATUS.NOT_ON_SALE]: '暂停售卖'
}
