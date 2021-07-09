// 批量同步类型
export enum BATCH_SYNC_TYPE {
  UPDATE = 1,
  CONCAT = 2,
  COPY = 3,
  CATEGORY = 4,
}
// 批量同步
export enum BATCH_NEW_STUFF {
  STOCK = 1,
  SELL_STATUS = 2
}
// 批量同步 内容
export enum BATCH_SYNC_CONTENT_TYPE {
  BASE = 1,
  IMG = 2,
  STOCK = 3,
  PRICE = 4,
  STATUS = 5
}

/**
 * excel 类型 2: 商品编号 3: UPC 4: 商品标题
 */
// 批量 excel 批量类型
export enum BATCH_EXCEL_TYPE {
  SKU = '1',
  NUMBER = '2',
  UPC = '3',
  TITLE = '4',
}

/**
 * 匹配类型
 * 1: 商品标题
 * 2: UPC
 * 3: SKU
 * 4: 组包商品名称
 */
// 批量 商品匹配 类型
export enum BATCH_MATCH_TYPE {
  PRODUCT = '1',
  UPC = '2',
  SKU = '3',
  PRODUCT_PACKAGE_TITLE = '4',
  PRODUCT_NAME = '5'
}
// 批量 上传图片 类型
export enum BATCH_UPLOAD_IMG_TYPE {
  UPC = '1',
  PRODUCT_NAME = '3',
  SKU = '4',
}

/**
 * 任务状态类型
 * 100：待处理
 * 200：处理中
 * 300：全部成功
 * 301：全部失败
 * 302：部分成功、部分失败
 * 400：已中断
 */
export enum BATCH_TASK_STATUS_TYPE {
  PENDING = '100', // 待处理
  DOING = '200', // 处理中
  SUCCESS = '300', // 全部成功
  FAIL = '301', // 全部失败
  PART_SUCCESS = '302', // 成功xx 失败xx
  INTERRUPTED = '400' // 已中断
}

/**
 * 批量关联任务处理状态
 * 10: 排队中
 * 20: 处理中
 * 60: 处理完成
 **/
export enum BATCH_REL_TASK_STATUS {
  INLINE = 10, // 排队中
  IN_PROCESS = 20, // 处理中
  FINISH = 60 // 处理完成
}

/**
 * 批量关联任务处理结果状态
 * 300: 成功
 * 302: 部分成功
 * 301: 失败
 **/
export enum BATCH_REL_TASK_RESULT_STATUS {
  PROCESSING = 200, // 处理中
  ALL_SUCCESS = 300,
  PART_SUCCESS = 302,
  FAIL = 301
}

/**
 * 批量关联匹配类型
 */
export enum BATCH_REL_MATCH_TYPE {
  UPC = '3',
  PRODUCT_NUM = '4',
  PRODUCT_NAME = '5'
}

/**
 * 批量任务处理结果状态
 * 600: 成功
 * 602: 部分成功
 * 601: 失败
 **/
export enum BATCH_TASK_RESULT_STATUS {
    // PROCESSING = 200, // 处理中
    ALL_SUCCESS = 600,
    FAIL = 601,
    PART_SUCCESS = 602
}
