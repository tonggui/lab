/**
 * 类目属性类型
 */
export enum ATTR_TYPE {
  SELL = 2,
  SPECIAL = 1,
  BASE = 3
}
/**
 * 类目属性值类型
 */
export enum VALUE_TYPE {
  SINGLE_SELECT = 1,
  MULTI_SELECT = 2,
  INPUT = 3
}
/**
 * 类目属性渲染类型
 */
export enum RENDER_TYPE {
  SELECT = 1, // select展示
  CASCADE = 2, // 及联展示
  INPUT = 3, // input展示
  BRAND = 4
}

// 品牌和产地特殊处理
export enum SPECIAL_CATEGORY_ATTR {
  BRAND = 1200000088,
  ORIGIN = 1200000094
}
/**
 * 分类模版类型
 */
export enum TEMPLATE_TYPE {
  BUSINESS = 1, // B端
  CLIENT = 2 // C端
}
/**
 * 智能排序
 */
export enum TAG_SMART_SORT {
  OPEN = 1,
  CLOSE = 2
}
// 1-删除分类中的商品及二级分类；2-仅删除分类
export enum TAG_DELETE_TYPE {
  TAG = 2,
  PRODUCT = 1
}
