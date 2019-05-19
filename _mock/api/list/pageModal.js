/**
 * @url /reuse/sc/product/list/pageData
*/
module.exports = function() {
  return {
    msg: 'pagemoadl',
    code: 1,
    data: {
      unRelationProduct: 20,
      hasTransitionProduct: true, // 是否有中间态商品
      associateSwitch: true, // 算法拆解关联开关，默认打开
      incompleteSwitch: true, // 信息不全开关，默认为打开
      isInRetailWhiteList521: true, // 521信息不全灰度白名单，默认为false
      packetSupport: true, // 是否支持购物袋
      marketFlag: true, // 是否是商超店铺
    }
  }
}
