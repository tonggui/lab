/**
 * 类目属性类型
 */
export enum ATTR_TYPE {
  SELL = 2, // 销售属性
  SPECIAL = 1, // 关键属性
  BASE = 3 // 基本属性
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
 * 类目属性值文本支持类型
 */
export enum REG_TYPE {
  CHN = 1,
  CHAR = 2,
  NUM = 3,
  SYM = 4
}
/**
 * 类目属性渲染类型
 */
export enum RENDER_TYPE {
  SELECT = 1, // select展示
  CASCADE = 2, // 及联展示
  INPUT = 3, // input展示
  BRAND = 4 // select展示
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
// 1-删除分类中的商品及二级分类；2-仅删除分类；3-删除总部分类和商品
export enum TAG_DELETE_TYPE {
  TAG = 2,
  PRODUCT = 1,
  MERCHAHT_TAG = 3
}
// 店内分类管理 操作类型
export enum TAG_OPERATION_TYPE {
  CREATE = 0, // 新建分类
  TITLE = 1, // 修改标题
  TOP_TIME = 2, // 修改限时置顶
  SET_CHILD_TAG = 3, // 设置为二级分类
  ADD_CHILD_TAG = 4, // 新增二级分类
  DELETE = 5, // 删除分类,
  SET_FIRST_TAG = 6 // 设为一级分类
}
