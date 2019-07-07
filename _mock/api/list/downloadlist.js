/**
 * @url /reuse/sc/product/task/r/list
 */
module.exports = function (req) {
  const type = req.body.type
  if (!type) {
    return {
      code: 0,
      msg: '',
      data: {
        "pageNum": 1,
        "pageSize": 30,
        "totalPage": 10,
        "totalSize": null,
        "list": null,
        "data|7": [{
          "name": "@cname",
          "message": null,
          "id": "@id",
          "type|1": [1, 2, 3, 4, 5, 7, 8, 10, 12, 13, 15],
          "result|1": [0, 1, 2],
          "status|1": [0, 1, 2],
          "source": 1,
          "valid": 0,
          "ctime|1": [1559033732934, 1558619667],
          "utime": 1558619667,
          "output": "http://vfile.meituan.net/scproduct/f916ec9b8500f7d81ee1ed4a68cac4f912800.xls",
          "source_poi": "",
          "target_poi": "2756215",
          "target_poi_url": null,
          "wmProductTaskScheduleDetailVos": null,
          "muid": 36857726,
          "cuid": 36857726,
          "wmProductTaskScheduleDetails": null,
          "time|1": [1559033732934, 1558619667],
          "statusType|1": [100, 200, 301, 302, 303, 400],
          "statusParam1": 50,
          "statusParam2": 50
        }]
      }
    }
  }
  return {
    code: 0,
    msg: '',
    data: {
      "data|10": [{
        name: '下载店内商品',
        utime: '@date',
        "status|1": [0, 1],
        "result|1": [0, 1],
        output: '@url'
      }]
    }
  }
}
