export const PERMISSION_TYPE_MAP = {
  ALL: -999, // 全部权限
  CREATE: 111000, // 新建商品
  EDIT: 111100, // 修改商品信息
  MODIFY_PRICE: 111200, // 修改价格
  MODIFY_STOCK: 111300, // 修改库存
  MODIFY_ON_AND_OFF_SHELVES: 111400, // 修改上/下架状态
  CREATE_CLASSIFICATION: 111500, // 新建分类
  MODIFY_CLASSIFICATION: 111600, // 修改分类
  MANAGE_PRODUCT_AND_CLASSIFICATION_SORT: 111700, // 管理商品/分类排序
  DEL_CLASSIFICATION: 111800, // 删除分类
  DEL_PRODUCT: 111900, // 删除商品
  RECYCLE_BIN: 112000 // 回收站
}
