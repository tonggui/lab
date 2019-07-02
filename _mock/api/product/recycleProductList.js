/**
 * @url /reuse/sc/product/retail/r/getRecycleProductList
 */
module.exports = function(req) {
  const { pageNum, pageSize } = req.body;
  return {
    msg: '',
    code: 0,
    data: {
      pageNum,
      pageSize,
      totalPage: 10,
      total: 100,
      "list|20": [{
        id: "@uuid",
        "name|+1": "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
        "picture|1": ["", "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg", "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg", "http://p0.meituan.net/scproduct/249d088af44bd87744fd7569c833eae3147107.jpg"],
        "tagId": "@uuid",
        "tagName": "@cname"
      }]
    }
  }
}
