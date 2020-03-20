/**
 * @url /reuse/sc/product/shangou/category/r/getCategoryAppealInfo
 */
module.exports = function (req) {
  const wmPoiId = +req.body.wmPoiId
  const spuId = +req.body.spuId
  return {
    code: 0,
    msg: '',
    data: {
      id: 1,
      wmPoiId,
      spuId,
      suggestCategoryId: 111
    }
  }
};