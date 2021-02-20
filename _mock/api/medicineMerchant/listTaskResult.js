/**
 * @url /reuse/mpc/product/r/listTaskResult
 */

module.exports = module.exports = function (req) {
  const type = req.body.type
  return {
    code: 0,
    msg: '',
    data: {
      "pageNum": 1,
      "pageSize": 30,
      "totalPage": 10,
      "totalSize": 100,
      "totalCount": 100,
      "list|6": [{
        "name": "@cname",
        "id": "@id",
        "type|1": [0, 9001, 9002, 9003, 9004, 121],
        "time|1": [1564489541, 1564489571, 1564541238, 1564541238, 1564553827, 1564558527],
        "statusType|1": [100, 200, 301, 302, 303, 400],
        "statusParam1": 50,
        "statusParam2": 50,
        "resultUrl|1": ['', 'http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1'],
        "contentUrl|1": ['', 'http://vfile.meituan.net/scproduct/f916ec9b8500f7d81ee1ed4a68cac4f912800.xls'],
        "detailUrl": 'http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1'
      }],
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
        "outputListUrl|1": ['', 'http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1'],
        "output": "http://vfile.meituan.net/scproduct/f916ec9b8500f7d81ee1ed4a68cac4f912800.xls",
        "source_poi": "",
        "target_poi": "2756215",
        "target_poi_url": null,
        "wmProductTaskScheduleDetailVos": null,
        "muid": 36857726,
        "cuid": 36857726,
        "wmProductTaskScheduleDetails": null
      }]
    }
  }
}