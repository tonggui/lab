/**
 * @url reuse/sc/product/hqcc/r/listSoldOutPoi
*/
module.exports = function (req) {
  const { pageNum, pageSize } = req.body
  return {
    code: 0,
    msg: '',
    data: {
      pageSize: 20,
      pageNum: 1,
      totalCount: 100,
      "wmPois|20": [{
        "wmPoiId|+1": (pageNum - 1) * pageSize + 1,
        wmPoiName: "@ctitle(4, 30)",
        wmPoiAddress: "@ctitle(4, 30)",
        subscribeCount: 20,
        "subscribeStatus|1": [1, 2]
      }]
    }
  }
}
