export const BUSINESS_MODULE = {
  SINGLE_POI_PRODUCT: 'single-poi-product', // 单店管理商品
  SINGLE_POI_TAG: 'single-poi-tag', // 单店管理分类
  MERCHANT_PRODUCT: 'merchant-product', // 商家商品中心管理商品
  MERCHANT_TAG: 'merchant-tag' // 商家商品中心管理分类
}

export const MODULE_SUB_TYPE = {
  PRODUCT_APPLY: 'product-apply', // 商品上报
  CREATE: 'create', // 新建商品、新建分类
  UPDATE: 'update', // 更新商品、更新分类
  DELETE: 'delete', // 删除商品、删除分类
  DELETE_WITH: 'delete-with', // 删除分类及商品
  ON_SHELF: 'on-shelf', // 商品上架
  OFF_SHELF: 'off-shelf', // 商品下架
  UPDATE_PRICE: 'update-price', // 商品更新价格
  UPDATE_STOCK: 'update-stock', // 商品更新库存、库存清零
  UPDATE_TITLE: 'update-title', // 商品更新标题、分类修改名称
  UPLOAD_PIC: 'upload-pic', // 上传图片
  TO_TOP: 'to-top' // 商品置顶、分类置顶
}
