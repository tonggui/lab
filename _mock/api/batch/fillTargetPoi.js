/**
 * @url /reuse/sc/product/food/batch/r/fillTargetPoi
 */
module.exports = function (req) {
  const ids = req.body.wmPoiIds
  const idList = ids ? ids.split(/,|，/) : []
  const data = idList.map(id => (
    {
      wmPoiId: +id,
      "wmPoiName": '@name',
      "ownerUid": '@guid',
      "ownerName": '@cname',
      "brandName": '@name',
      "brandId|1000000-2000000": 1111111,
    }
  ))
  return {
    code: 0,
    msg: '',
    data: {
      wmPoiList: data,
    },
  }
}