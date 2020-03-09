/**
 * @url reuse/sc/product/shangou/r/getValidationConfigByWmPoiId
 * */
module.exports = {
 code: 0,
 msg: '',
 data: {
    // 字段锁定
    propertyEditLock: false,
    // 重量选填
    weightNotEmpty: false,
    // upc 选填
    upcNotEmpty: false,
    // 图文详情
    allowGraphicDescription: false,
    // 商品视频
    allowProductVideo: true,
    // 智能分类
    allowIntelligentProductTag: false,
    // 多分类
    allowMultiProductTag: false,
    // 信息不全 不展示信息不全打标
    informationLossWithPicture: false,
    // 是否 强制关联
    relateProductLibRequired: false,
    // 是否 允许自建
    allowCustomProduct: true,
    // 强制下架
    forcePullOffShelves: false,
    // 信息不全入口
    hasInformationLoss: false,
    // 是否允许修改售卖属性（价格/库存）
    allowModifySellProperty: false
  }
}