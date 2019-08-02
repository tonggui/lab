/**
 * 平台变量
 */
export enum PLATFORM {
  PRODUCT = 1,
  MERCHANT = 2
}

// TODO 品牌来源 0: 非标品 1: 标品
export enum BRAND_SOURCE {
  STANDARD = 1,
  NORMAL = 0
}

/**
 * 置顶或取消
 */
export enum TOP_STATUS {
  TOP = 1,
  NOT_TOP = 2
}

export enum SUGGESTION_TYPE {
  BRAND = 1,
  PRODUCT = 2
}
