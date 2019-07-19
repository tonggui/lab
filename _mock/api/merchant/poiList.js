/**
 * @url reuse/sc/product/hqcc/r/listSuggestPoi
 */
module.exports = function (req) {
  const pageSize = req.query.pageSize
  const pageNum = req.query.pageNum
  return {
    code: 0,
    msg: '',
    data: {
      totalCount: 20,
      "list|10": [{
        "id": "@uuid",
        name: "@cname",
        address: "@address"
      }]
    } 
  }
}