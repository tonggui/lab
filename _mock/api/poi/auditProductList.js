/**
 * @url /reuse/sc/product/shangou/r/audit/list
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    page: {
      pageNo: 1,
      pageSize: 20,
      total: 9999
    },
    "data|20": [{
      "processId|+1": 1,//审核流程Id
      wmPoiId: 123,
      merchentAccount: "XXX",
      "productId|+1": 222,
      "name|1": [
        "酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml酷儿维生素C+钙香橙汁450ml",
        "可口可乐"
      ],
      upc: "69xxxxxxxxxxx",
      categoryId: 123,
      categoryName: "办公用品",
      categoryNamePath: "日用百货,办公文具,办公用品",
      brandId: 1234,
      brandName: "家乐福",
      pictures: "http://p0.meituan.net/mallimages/83ee82d46deb91585f7db1a7c38eb43056974.jpg@88h_88w_1e",
      "auditStatus|1": [0, 1, 2, 3, 4, 5],
      auditer: "zhangsan",
      source: 1, //数据来源  1-运营，2-商家申报，3-商家纠错，4-品牌商，5-品牌商纠错，6-商家回流
      createTime: 1583415645021,
      lastUpdateTime : 1583415645021
    }]
  }
}
