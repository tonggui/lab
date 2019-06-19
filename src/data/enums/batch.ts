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
};
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
};
