/**
 * @url reuse/sc/product/shangou/r/getValidationConfigByCategoryIds
 */
module.exports = function (req) {
  const poiId = req.body.wmPoiId
  const categoryId = req.body.categoryId
  if (!categoryId && poiId === '123') {
    return {
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
        allowProductVideo: false,
        // 智能分类
        allowIntelligentProductTag: false,
        // 多分类
        allowMultiProductTag: false,
        // 信息不全 不展示信息不全打标
        infomationLossWithPicture: false,
        // 是否 强制关联
        relateProductLibRequired: false,
        // 是否 允许自建
        allowCustomProduct: false,
        // 强制下架
        forcePullOffShelves: false,
        // 信息不全入口
        hasInfomationLoss: false,
        // 是否允许修改售卖属性（价格/库存）
        allowModifySellProperty: false
      }
    }
  }
  return {
    code: 0,
    msg: '',
    data: {
      // 字段锁定
      propertyEditLock: true,
      // 重量选填
      weightNotEmpty: true,
      // upc 选填
      upcNotEmpty: true,
      // 图文详情
      allowGraphicDescription: true,
      // 商品视频
      allowProductVideo: true,
      // 智能分类
      allowIntelligentProductTag: true,
      // 多分类
      allowMultiProductTag: true,
      // 信息不全 不展示信息不全打标
      infomationLossWithPicture: true,
      // 是否 强制关联
      relateProductLibRequired: true,
      // 是否 允许自建
      allowCustomProduct: true,
      // 强制下架
      forcePullOffShelves: true,
      // 信息不全入口
      hasInfomationLoss: true,
      // 是否允许修改售卖属性（价格/库存）
      allowModifySellProperty: true
    }
  }
}
