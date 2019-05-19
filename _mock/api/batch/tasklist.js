/**
 * @url /reuse/sc/product/retail/sync/task/r/list
 */
module.exports = {
  msg: '',
  code: 0,
  data: {
    pageNum: 0,
    pageSize: 3,
    totalPage: 10,
    totalSize: 100,
    // data: [],
    "data|2": [{
      taskId: "@id",
      "ctime|1": [1548961200, 1550663516],
      syncDesc: '绝对不卡脚呢；dklndkandklandkandlak等不及啊可是你的快乐；你得不到你打了款卡就不淡定；来看',
      "status|1": [0, 1, 2],
      "result|1": [0, 1, 2],
      "syncType|1": [1, 2, 3, 4],
      "syncContent": [1, 2, 3, 4, 5],
      "progress": "@float(0, 1, 2, 2)",
      "exceptionContent": "http://s3plus.sankuai.com/v1/mss_73a2bbf6170448d185fc9b84a48d2920/product-sync/3920499-detail.html",
      "progressDetail":  `分店ID：5810086，处理详情：
      匹配商品数 5，待更新商品数 5，成功更新商品数 2
      删除商品数 0，成功删除商品数 0
      新增商品数 0，成功新增商品数 0
      分店ID：5985515，处理详情：
      匹配商品数 1，待更新商品数 1，成功更新商品数 1
      删除商品数 0，成功删除商品数 0
      新增商品数 0，成功新增商品数 0`
    }]
  }
}

