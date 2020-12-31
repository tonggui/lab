/*
 * @description
 *   Please write the fields.js script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2018/5/20)
 */

/** 纠错审核FILEDS
 * 1-category 商品类目
 * 2-brandName 商品品牌
 * 3-originName 产地
 * 4-title 标题
 * 5-spec 规格名称
 * 6-unit 商品单位
 * 7-weight 重量
 * 8-pic 商品图片
 */
export enum ERROR_CORRECTION_FIELDS_MAP {
  CATEGORY = 1,
  BRAND = 2,
  ORIGIN = 3,
  TITLE = 4,
  SPEC = 5,
  UNIT = 6,
  WEIGHT = 7,
  PICTURE = 8,
  WEIGHT_UNIT = 9
}

// TODO
export enum SP_CHANGE_FIELD {
  // 商品标题
  NAME = 1,
  // 商品类目
  CATEGORY = 6,
  // 商品重量
  WEIGHT = 3,
  // 商品图片
  PICTURE_LIST = 10,
  // 规格
  SPEC_NAME = 2,
  // Upc
  UPC_CODE = 9,
  // !!!药品专属!!! 建议零售价
  SUGGESTED_PRICE = 12
}

/** 白名单（可编辑白名单、选填白名单）
 * 1-name 商品标题
 * 2-spec 规格名称
 * 3-weight 重量
 * 4-unit 商品单位
 * 5-brand 商品品牌
 * 6-category 商品类目
 * 7-spname 商品名
 * */
export enum WHITELIST_FIELDS_MAP {
  TITLE = 1,
  SPEC = 2,
  WEIGHT = 3,
  UNIT = 4,
  BRAND = 5,
  CATEGORY = 6,
  NAME = 7,
  WEIGHT_UNIT = 8,
  UPC = 9
}

/**
 * 模块儿白名单配置信息
 * @type {{'7': string, '8': string}}
 */
export enum WHITELIST_MODULES_MAP {
  TAG_SMART_SORT = 6, // 分类智能排序
  PICTURE_CONTENT = 7, // 图文详情
  PRODUCT_VIDEO = 8, // 视频
  MULTI_TAG = 9 // 店内多分类
}
