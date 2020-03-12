/**
 * @url /reuse/sc/product/hqcc/r/getCategoryAppealInfo
 */
module.exports = function (req) {
  const spuId = +req.body.spuId
  return {
    code: 0,
    msg: '',
    data: {
      id: 1,
      spuId,
      suggestCategoryId: 111
    }
  }
};