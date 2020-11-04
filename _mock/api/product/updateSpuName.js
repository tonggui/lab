/**
 * @url /reuse/sc/product/retail/w/updateSpuName
 */
module.exports = function (req) {
  const { checkActivitySkuModify } = req.body
  return {
    code: 0, // JSON.parse(checkActivitySkuModify) ? 11001 : 0,
    msg: '目前商品在XXXX活动中，修改信息会导致该商品无法继续参与活动，是否确认编辑？',
    data: null
  }
};
