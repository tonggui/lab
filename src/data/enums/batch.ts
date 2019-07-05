export enum BATCH_SYNC_TYPE {
  UPDATE = 1,
  CONCAT = 2,
  COPY = 3,
  CATEGORY = 4
}

export enum BATCH_NEW_STUFF {
  STOCK = 1,
  SELL_STATUS = 2
}

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
 */
export enum BATCH_MATCH_TYPE {
  PRODUCT = '1',
  UPC = '2',
  SKU = '3',
}

export enum BATCH_UPLOAD_IMG_TYPE {
  UPC = '1',
  PRODUCT_NAME = '3',
  SKU = '4',
}

/**
 * 任务状态类型
 * 100：待处理
 * 200：处理中
 * 301：部分成功、部分失败
 * 302：全部成功
 * 303：全部失败
 * 400：已中断
 */
export enum BATCH_TASK_STATUS_TYPE {
  PENDING = '100', // 待处理
  DOING = '200', // 处理中
  PART_SUCCESS = '301', // 成功xx 失败xx
  SUCCESS = '302', // 全部成功
  FAIL = '303', // 全部失败
  INTERRUPTED = '400' // 已中断
}
