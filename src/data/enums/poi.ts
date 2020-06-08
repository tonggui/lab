// 门店是否在上单流程中
export enum PROCESS_STATUS {
  ON_PROCESS = 1, // 上单中
  NONE_PROCESS = 2 // 不在上单流程中
}

export enum STATUS {
  // NOT_ON_PROCESS = 0,
  NOT_AUDITED = 1,
  AUDITING = 2,
  REJECTED = 3,
  PASSED = 4
}

export enum POI_TYPE {
  MARKET = 1, // 超市
  FRUIT = 2, // 水果
  CLOTHES = 4, // 服装
  MAKE_UP = 5, // 美妆
  COMMODITY = 6, // 日用品
  MOTHER_CHILD = 7 // 母婴
}

export enum CANCEL_ORDER_TYPE {
  MERCHANT = 1, // 门店因无货取消订单
  CUSTOMER = 2 // 买家因无货取消订单
}
