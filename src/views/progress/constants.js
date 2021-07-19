// 批量处理的任务状态
export const STATUS = {
  DOING: 0,
  COMPLETE: 1,
  FAIL: 2
}

// 批量处理的任务状态的描述
export const STATUS_STR = {
  [STATUS.COMPLETE]: '已完成',
  [STATUS.FAIL]: '处理失败',
  [STATUS.DOING]: '处理中'
}
// 批量处理的任务状态的描述
export const MEDICINE_SETTINGS_STATUS_STR = {
  [STATUS.COMPLETE]: '已完成',
  [STATUS.FAIL]: '已完成，有城市配置失败',
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
  UPLOAD_UPDATED_EXCEL: 15, // 批量商品信息确认
  // SYNC_NEW: 20, // 新版跨店同步商品
  MEDICINE_EXPORT: 31, // 医药多门店批量导出
  MEDICINE_UPDATE_SELL_STATUS: 32, // 医药多门店批量修改状态
  MEDICINE_UPDATE_STOCK: 33, // 医药多门店批量修改库存
  MEDICINE_UPDATE_PRICE: 34, // 医药多门店批量修改价格
  MEDICINE_DELETE: 35 // 医药多门店批量删除
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
  [TYPE.UPLOAD_UPDATED_EXCEL]: '查看批量确认商品信息详情',
  [TYPE.MEDICINE_EXPORT]: '查看批量导出详情',
  [TYPE.MEDICINE_UPDATE_SELL_STATUS]: '查看批量上下架详情',
  [TYPE.MEDICINE_UPDATE_STOCK]: '查看批量修改库存详情',
  [TYPE.MEDICINE_UPDATE_PRICE]: '查看批量修改价格详情',
  [TYPE.MEDICINE_DELETE]: '查看批量删除详情'
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
  [TYPE.UPLOAD_UPDATED_EXCEL]: 'LINK',
  [TYPE.MEDICINE_EXPORT]: 'MODAL',
  [TYPE.MEDICINE_UPDATE_SELL_STATUS]: 'MODAL',
  [TYPE.MEDICINE_UPDATE_STOCK]: 'MODAL',
  [TYPE.MEDICINE_UPDATE_PRICE]: 'MODAL',
  [TYPE.MEDICINE_DELETE]: 'MODAL'
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
  [TYPE.UPLOAD_UPDATED_EXCEL]: 'output',
  [TYPE.MEDICINE_EXPORT]: {
    title: '批量导出详情',
    modalType: 'DETAIL_COMMON'
  },
  [TYPE.MEDICINE_UPDATE_SELL_STATUS]: {
    title: '批量上下架详情',
    modalType: 'MEDICINE_DETAIL_UPDATE'
  },
  [TYPE.MEDICINE_UPDATE_STOCK]: {
    title: '批量修改库存详情',
    modalType: 'MEDICINE_DETAIL_UPDATE'
  },
  [TYPE.MEDICINE_UPDATE_PRICE]: {
    title: '批量修改价格详情',
    modalType: 'MEDICINE_DETAIL_UPDATE'
  },
  [TYPE.MEDICINE_DELETE]: {
    title: '批量删除详情',
    modalType: 'MEDICINE_DETAIL_UPDATE'
  }
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
  [TYPE.UPLOAD_UPDATED_EXCEL]: '',
  [TYPE.MEDICINE_EXPORT]: '下载导出文件',
  [TYPE.MEDICINE_UPDATE_SELL_STATUS]: '',
  [TYPE.MEDICINE_UPDATE_STOCK]: '',
  [TYPE.MEDICINE_UPDATE_PRICE]: '',
  [TYPE.MEDICINE_DELETE]: '下载被删除商品'
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
  [TYPE.UPLOAD_UPDATED_EXCEL]: '',
  [TYPE.MEDICINE_EXPORT]: '未匹配到任何商品',
  [TYPE.MEDICINE_UPDATE_SELL_STATUS]: '未匹配到任何商品',
  [TYPE.MEDICINE_UPDATE_STOCK]: '未匹配到任何商品',
  [TYPE.MEDICINE_UPDATE_PRICE]: '未匹配到任何商品',
  [TYPE.MEDICINE_DELETE]: '未匹配到任何商品'
}

export const MUT_MODE = {
  'NAME': 1, // 商品名称
  'UPC': 2,
  'SKU': 3,
  'PACKAGE_PRODUCT_NAME': 4, // 组包商品名称
  'MEDICINE_MUlTI_STORE': 5 // 医药多门店管理
}

export const MUT_MODE_STR = {
  [MUT_MODE.NAME]: '商品名称',
  [MUT_MODE.UPC]: 'UPC/EAN/条形码',
  [MUT_MODE.SKU]: 'SKU码/货号',
  [MUT_MODE.PACKAGE_PRODUCT_NAME]: '按组包商品名称匹配',
  [MUT_MODE.MEDICINE_MUlTI_STORE]: '多门店查询匹配'
}

export const SELL_STATUS = {
  'SELLING': 0,
  'NOT_ON_SALE': 1
}

export const SELL_STATUS_STR = {
  [SELL_STATUS.SELLING]: '售卖中',
  [SELL_STATUS.NOT_ON_SALE]: '暂停售卖'
}

export const MERCHANT_STATUS = {
  PENDING: 100, // 待处理
  DOING: 200, // 处理中
  DOING_PART_FAIL: 201, // 处理中，有部分失败
  SUCCESS: 300, // 全部成功
  FAIL: 301, // 全部失败
  PART_SUCCESS: 302, // 成功xx 失败xx
  INTERRUPTED: 400 // 已中断
}

// 和MERCHANT_STATUS对应
export const MERCHANT_STATUS_TEXT = {
  100: '待处理',
  200: '处理中',
  300: '全部成功',
  301: '全部失败',
  302: '部分成功',
  400: '已中断'
}

// 和MERCHANT_STATUS对应
export const MERCHANT_CUBE_STATUS = {
  PENDING: 100, // 待处理
  DOING: 200, // 处理中
  DOING_PART_FAIL: 201, // 处理中，有部分失败
  SUCCESS: 300, // 全部成功
  FAIL: 301, // 全部失败
  PART_SUCCESS: 302, // 成功xx 失败xx
  INTERRUPTED: 400 // 已中断
}
