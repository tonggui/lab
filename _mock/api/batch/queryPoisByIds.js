/**
 * @url /reuse/sc/product/sync_food/queryPoisByIds
 */
module.exports = function (req) {
  const ids = req.body.wmPoiIds
  const idList = ids ? ids.split(/,|，/) : []
  const data = idList.map(id => (
    {
      wmPoiId: +id,
      "wmPoiName": '@name',
      "num|1-100": 1,
      "owner": '@cname',
      "wmPoiBrand": '@name',
      "wmPoiBrandId|1000000-2000000": 1111111,
    }
  ))
  return {
    code: 0,
    msg: '',
    data,
  }
}
