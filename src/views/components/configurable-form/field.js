export const SPU_FIELD = {
  UPC_CODE: 'upcCode', // 快捷输入upc
  NAME: 'name', // 商品标题
  CATEGORY: 'category', // 商品类目
  TAG_LIST: 'tagList', // 店内分类
  IS_MEDICARE: 'isMedicare', // 是否是医保商品
  PICTURE_LIST: 'pictureList', // 商品图片
  MARKETING_PICTURE: 'marketingPicture', // 商品营销首图
  UPC_IMAGE: 'upcImage', // upc 条形码图
  PRODUCT_VIDEO: 'video', // 商品视频
  PRODUCT_SP_VIDEO: 'spVideo', // 商品品牌视频
  PRODUCT_SP_VIDEO_STATUS: 'spVideoStatus', // 商品品牌视频状态
  CATEGORY_ATTRS: 'normalAttributesValueMap', // 类目属性
  SKU_LIST: 'skuList',
  LIMIT_SALE: 'limitSale', // 限购信息
  ATTRIBUTE_LIST: 'attributeList', // 商品属性
  SALE_TIME: 'shippingTime', // 可售时间
  LABEL_LIST: 'labelList', // 商品标签
  DESCRIPTION: 'description', // 商品描述
  PICTURE_CONTENT: 'pictureContentList', // 图片详情
  SP_PICTURE_CONTENT: 'spPictureContentSwitch', // 品牌图文详情
  SELL_STATUS: 'sellStatus', // 上下架
  FREIGHT_TEMPLATE: 'b2cSinglePoi', // b2c医药单店显示运费模板
  SALE_TYPE: 'preSale' // 售卖方式
}

export const SKU_FIELD = {
  SPEC_NAME: 'specName', // 规格
  PRICE: 'price', // 价格
  STOCK: 'stock', // 库存
  WEIGHT: 'weight', // 重量
  MIN_ORDER_COUNT: 'minOrderCount', // 最小购买量
  BOX: 'box', // 包装袋
  SOURCE_FOOD_CODE: 'sourceFoodCode', //  sku/货号
  UPC_CODE: 'upcCode', // upc
  SHELF_NUM: 'shelfNum', // 货架号
  SUGGESTED_PRICE: 'suggestedPrice' // 指导价
}

export const DETAIL_ATTR_MAP = {
  10: SPU_FIELD.NAME,
  19: SPU_FIELD.CATEGORY,
  5: SPU_FIELD.TAG_LIST,
  20: [SPU_FIELD.PICTURE_LIST, SPU_FIELD.PICTURE_CONTENT],
  23: SPU_FIELD.PRODUCT_VIDEO,
  901: SKU_FIELD.PRICE,
  908: SKU_FIELD.STOCK,
  914: SKU_FIELD.WEIGHT,
  17: SKU_FIELD.MIN_ORDER_COUNT,
  909: SKU_FIELD.BOX,
  912: SKU_FIELD.SOURCE_FOOD_CODE,
  913: SKU_FIELD.UPC_CODE,
  12: SPU_FIELD.DESCRIPTION,
  4: SPU_FIELD.ATTRIBUTE_LIST,
  18: SPU_FIELD.SALE_TIME,
  15: SPU_FIELD.LABEL_LIST,
  903: SPU_FIELD.SELL_STATUS,
  907: SKU_FIELD.SPEC_NAME
}
