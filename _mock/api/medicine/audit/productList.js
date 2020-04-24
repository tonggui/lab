/**
* @url /reuse/sc/product/shangou/medicine/audit/r/listAuditSp
 */
module.exports = {
  msg: '',
  code: 0,
  data: {
    pageNum: 1,
    pageSize: 20,
    totalCount: 100,
    "standardProductList|20": [{
      name: '@ctitle(5, 30)',
      "spSkuId": "@uuid",
      category: {
        id: 123,
        categoryName: '商品类目',
        idPath: '123,123',
        namePath: '商品类目1,商品类目2'
      },
      "upcList|2-4": ["@uuid"],
      picList: [
        "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
        "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
        "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
        "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg"
      ],
      "auditStatus|1": [1, 2, 3, 5],
      ctime: 1586514029640
    }]
  }
}
