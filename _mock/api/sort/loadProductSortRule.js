/**
 * @url /reuse/sc/product/retail/r/skuSortRule
 */
module.exports = function (req) {
  const tagId = Number(req.query.tagId);
  const wmPoiId = Number(req.query.wmPoiId);
  return {
    code: 0,
    msg: '',
    data: {
      'sortType|1-2': 1,
      tagId,
      'topCount|0-50': 0,
      wmPoiId,
    },
  };
};
