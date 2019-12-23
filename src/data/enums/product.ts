export enum PRODUCT_MARK {
  SUSPENDED_SALE = 'notBeSold', // 已下架
  RC_SUSPENDED_SALE = 'rcNotBeSold', // 风控下架
  SOLD_OUT = 'soldOut', // 已售罄
  PART_SOLD_OUT = 'partSoldOut', // 部分售罄
  NEED_TO_FILL = 'needToFill', // 需补充
  NEED_TO_CHECK = 'needToCheck', // 待更新
  MERCHANT_DELETE = 'merchantDelete' // 总部删除
}

export enum RELEASE_TYPE {
  Release = 1,
  ReleaseReplace = 2
}

export enum SELLING_TIME_TYPE {
  Custom = 1,
  Infinite = 2
}

export enum WEIGHT_UNIT {
  G = '克(g)',
  KG = '千克(kg)',
  ML = '毫升(ml)',
  L = '升(L)',
  P = '磅'
}

export enum PRODUCT_STATUS {
  ALL = '0', // 全部商品
  SELLING = '1', // 售卖中
  SUSPENDED_SALE = '2', // 已下架
  SELL_OUT = '3', // 已售罄
  INCOMPLETE = '5', // 商品优化
  NOT_WHITE_BG = '6', // 非白底图(复用搜索结果页)
  POOR_PICTURE = '7'// 质量差图(复用搜索结果页)
}

export enum PRODUCT_SELL_STATUS {
  ON = 0, // 上架
  OFF = 1 // 已下架
}

export enum PRODUCT_BATCH_OP {
  PUT_ON = 0,
  PUT_OFF = 1,
  MOD_TAG = 3,
  MOD_STOCK = 4,
  MOD_TIME = 5,
  MOD_LABEL = 6,
  DELETE = 7
}

export enum QUALIFICATION_STATUS {
  YES = 0,
  NOT_ALLOWED = 9101, // 门店没有标品对应后台类目的售卖权限
  NO = 9102, // 门店没有资质
  EXP = 9103 // 或门店资质过期
}

export enum SKU_EDIT_TYPE {
  STOCK = 1,
  PRICE = 2
}

export enum API_ANOMALY_TYPE {
  PRICE = 1,
  STOCK = 2,
  UNSALABLE = 3
}
