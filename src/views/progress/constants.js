export const STATUS = {
  DOING: 0,
  SUCCESS: 1,
  FAIL: 2
}

export const RESULT = {
  SUCCESS: 1
}

export const STATUS_STR = {
  [STATUS.SUCCESS]: '已完成',
  [STATUS.FAIL]: '处理失败',
  [STATUS.DOING]: '处理中'
}

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

export const DETAIL_OPR = {
  [TYPE.CREATE]: 'DOWNLOAD',
  [TYPE.UPDATE]: 'VIEW',
  [TYPE.EXPORT]: 'VIEW',
  [TYPE.DELETE]: 'VIEW',
  [TYPE.SYNC]: 'VIEW',
  [TYPE.UPLOAD_IMGS]: 'VIEW',
  [TYPE.UPDATE_BY_EXCEL]: 'DOWNLOAD',
  [TYPE.UPLOAD_UNRELEASED_EXCEL]: 'DOWNLOAD',
  [TYPE.BATCH_RELEASE_ONLY]: 'DOWNLOAD',
  [TYPE.BATCH_RELEASE_REPLACE]: 'DOWNLOAD',
  [TYPE.UPLOAD_UPDATED_EXCEL]: 'DOWNLOAD'
}

export const DETAIL_MODAL_TITLE = {
  [TYPE.UPDATE]: '批量修改详情',
  [TYPE.EXPORT]: '批量导出详情',
  [TYPE.DELETE]: '批量删除详情',
  [TYPE.SYNC]: '查看同步详情',
  [TYPE.UPLOAD_IMGS]: '查看上传详情'
}

export const MUT_MODE = {
  'NAME': 1,
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
