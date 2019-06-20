export enum PRODUCT_MARK {
  SUSPENDED_SALE = 'notBeSold', // 已下架
  RC_SUSPENDED_SALE = 'rcNotBeSold', // 风控下架
  SOLD_OUT = 'soldOut', // 已售罄
  PART_SOLD_OUT = 'partSoldOut', // 部分售罄
  NEED_TO_FILL = 'needToFill', // 需补充
  NEED_TO_CHECK = 'needToCheck' // 待更新
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
  ALL = 0, // 全部商品
  SELLING = 1, // 售卖中
  SUSPENDED_SALE = 2, // 已下架
  SELL_OUT = 3, // 已售罄
  INCOMPLETE = 5 // 商品优化
}

export enum PRODUCT_SELL_STATUS {
  ON = 0, // 上架
  OFF = 1 // 已下架
}
