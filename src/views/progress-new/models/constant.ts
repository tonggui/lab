export enum MerchantTaskType {
  MULTI_CUBE_RECOMMEND = 1001, // 连锁魔方推荐
  BATCH_MODIFY_TAG = 112, // 批量修改分类
  BATCH_DELETE = 106, // 批量删除
  BATCH_CREATE_BY_EXCEL = 501, // excel批量新建
  BATCH_UPDATE_BY_EXCEL = 502, // excel批量修改
  BATCH_UPLOAD_PIC = 503, // 批量传图
  BATCH_SYNC = 504, // 批量同步
  NEW_BATCH_REL = 12003, // 批量关联(新)
  MEDICINE_BATCH_DOWNLOAD_PRODUCT = 121, // 医药商家商品中心 下载商品
  MEDICINE_MERCHANT_CATEGORY_OP = 8001, // 医药总部分类相关操作
  MEDICINE_BATCH_CREATE_BY_EXCEL = 9001, // 医药excel批量新建
  MEDICINE_BATCH_UPDATE_BY_EXCEL = 9002, // 医药excel批量修改
  MEDICINE_BATCH_CREATE_REL = 9003, // 医药批量新建关联关系
  MEDICINE_BATCH_DELETE_REL_BY_EXCEL = 9004, // 医药批量删除关联关系
  MEDICINE_UPDATE_PRICE = 9005, // 医药商家商品中心 向门店同步价格
  MEDICINE_UPDATE_STOCK = 9006, // 医药商家商品中心 向门店同步库存
  MEDICINE_UPDATE_SELL_STATUS = 9007, // 医药商家商品中心 向门店同步上下架状态
  MEDICINE_BATCH_DELETE = 9008 // 医药商家商品中心 向门店同步删除
}
