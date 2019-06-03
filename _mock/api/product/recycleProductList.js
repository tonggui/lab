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
      totalSize: 100,
      "list|5": [{
        id: "@uuid",
        "name|+1": "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
        "picture|1": ["http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg", "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg"],
        "tag_id": "@uuid",
        "tag_name": "@cname"
      }]
    }
  }
}
