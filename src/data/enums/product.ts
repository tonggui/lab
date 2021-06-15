export enum PRODUCT_MARK {
  PLATFORM_SUSPENDED_SALE = 'platformSuspendedSale', // 平台下架
  MISSING_INFORMATION = 'missingInformation', // 信息缺失
  SUSPENDED_SALE = 'notBeSold', // 已下架
  RC_SUSPENDED_SALE = 'rcNotBeSold', // 风控下架
  SOLD_OUT = 'soldOut', // 已售罄
  PART_SOLD_OUT = 'partSoldOut', // 部分售罄
  NEED_TO_FILL = 'needToFill', // 需补充
  NEED_TO_CHECK = 'needToCheck', // 待更新
  MERCHANT_DELETE = 'merchantDelete', // 总部删除
  AUDIT_REJECTED = 'auditRejected', // 审核驳回
  AUDITING = 'auditing' // 审核中
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
  P = '磅',
  JIN = '斤',
  LIANG = '两'
}

export enum PRODUCT_STATUS {
  ALL = '0', // 全部商品
  SELLING = '1', // 售卖中
  SUSPENDED_SALE = '2', // 已下架
  SELL_OUT = '3', // 已售罄
  INCOMPLETE = '5', // 商品优化
  NOT_WHITE_BG = '6', // 非白底图(复用搜索结果页)
  POOR_PICTURE = '7', // 质量差图(复用搜索结果页)
  EMPTY_CATEGORY = '8', // 空后台类目(复用搜索结果页)
  ERROR_CATEGORY = '9', // 错误后台类目(复用搜索结果页)
  MISSING_INFORMATION = '28', // 关键信息缺失
}

// 审核类型
// https://km.sankuai.com/page/405477367#id-1.1%E4%BF%9D%E5%AD%98%E5%95%86%E5%93%81(PC)
export enum PRODUCT_AUDIT_TYPE {
  START_SELL = 2, // 先发后审
  START_AUDIT = 1 // 先审后发
}

export enum MERCHANT_PRODUCT_STATUS {
  ALL = '0',
  MISSING_INFORMATION = '28', // 关键信息缺失
}

export enum MEDICINE_MERCHANT_PRODUCT_STATUS {
  ALL = '0',
  INCOMPLETE = '5', // 商品优化
  COMPLETED = '10', // 优化记录
  MISSING_INFORMATION = '28', // 关键信息缺失
}

export enum PRODUCT_SELL_STATUS {
  ALL = -1, // 全部
  ON = 0, // 上架
  OFF = 1 // 已下架
}

export enum PRODUCT_STOCK_STATUS {
  ALL = -1,
  IN = 0,
  OUT = 1
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

export enum MEDICINE_PRODUCT_BATCH_OP {
  CHANGE = 10
}

export enum QUALIFICATION_STATUS {
  YES = 0,
  NOT_ALLOWED = 9101, // 门店没有标品对应后台类目的售卖权限
  NO = 9102, // 门店没有资质
  EXP = 9103 // 或门店资质过期
}

export enum PACKAGE_PRODUCT_OPT_STATUS {
  SELL_STATUS_OFF_CONFIRM = 8301, // 下架组包商品确认提示
  DELETE_CONFIRM = 8302, // 删除组包商品提示
  UPDATE_STOCK_TIP = 8303, // 禁止修改组包商品库存提示
  SELL_STATUS_ON_CONFIRM = 8304, // 组包商品上架时，包含SKU为未上架状态提示确认
}

export enum SKU_EDIT_TYPE {
  STOCK = 1,
  PRICE = 2
}
// 审核枚举值
export enum PRODUCT_AUDIT_STATUS {
  ALL_NOT_PASS = -2, // 全量未审核通过
  SP_UNAUDIT = -1, // 标品 未送审 - 草稿
  UNAUDIT = 0, // 未审核
  AUDITING = 1, // 审核中
  AUDIT_APPROVED = 2, // 审核通过
  AUDIT_REJECTED = 3, // 审核驳回
  AUDIT_CORRECTION_REJECTED = 4, // 纠错审核驳回，纠错时指：1.商家在初始提交的审核是由于UPC存在+修改关键字段（UPC、类目、关键类目属性）所致。2. 审核通过后的商品修改关键字段（UPC、类目、关键类目属性）所致
  AUDIT_REVOCATION = 5, // 审核撤销
  START_SELL_AUDITING = 6 // 先发后审 审核中 可编辑
}

// data.dataSource || 2 // 数据来源 1-运营，2-商家申报，3-商家纠错，4-品牌商，5-品牌商纠错，6-商家回流
export enum AUDIT_PRODUCT_SOURCE {
  UNKNOWN = 0, // 未知
  OPERATOR = 1, // 运营添加
  MERCHANT_APPLY = 2, // 商家申报
  MERCHANT_CORRECTION = 3, // 商家纠错
  BRAND_APPLY = 4, // 品牌商申报
  BRAND_CORRECTION = 5, // 品牌商纠错
  MERCHANT_BACKFLOW = 6, // 商家回流
}

export enum API_ANOMALY_TYPE {
  PRICE = 1,
  STOCK = 2,
  UNSALABLE = 3
}

export enum OTC_TYPE {
  OTC = 1,
  PRESCRIPTION = 2,
  OTHER = 3
}

// 商品审核触发模式
export enum AuditTriggerMode {
  UNKNOWN = 0, // 未知
  CREATE = 1, // 新建
  MODIFY = 2 // 编辑
}

export enum PRODUCT_TYPE {
  // 普通商品
  NORMAL = 0,
  // 组包商品
  PACKAGE = 1
}

// 品牌商视频使用状态
export enum PRODUCT_BRAND_VIDEO_STATUS {
  // 未操作/未确认
  UNCONFIRMED = 0,
  // 暂时忽略，不使用
  DISABLED = 1,
  // 使用品牌商视频模式
  ENABLED = 2,
}

export enum NEW_ARRIVAL_PRODUCT_STATUS {
  // 已下架
  OFFSHELF = 1,
  // 已售罄
  SOLDOUT = 2,
  // 售卖中
  ONSALE = 3
}

/**
 * 魔方二期 商品类目
 * 0 - 系统 1 - 自定义
 */
export enum TAG_SOURCE {
  SYSTEM = 0,
  CUSTOM = 1
}

/**
 * 商品中心开通状态
 */
export enum MERCHANT_OPEN_STATUS {
  DEFAULT = 0,
  OPEN = 1,
  CLOSE = 2
}

// 售卖方式， 1 正常售卖，2 预售
export enum PRODUCT_SALE_TYPE {
  NORMAL = 1,
  PRE = 2
}
