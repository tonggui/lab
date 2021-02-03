/**
 * @url /health/pc/medicineSaleRule/task/list
*/
module.exports = function (req) {
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
        "taskName": "@cname",
        "createTime|1": [1564489541, 1564489571, 1564541238, 1564541238, 1564553827, 1564558527],
        "taskStatus|1": [0, 1],
        "failReasonUrl|1": ['', 'http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1'],
        "ruleUrl": 'http://s3plus.vip.sankuai.com/v1/mss_03d0d9cf21144ba0b7747ba1dc1acf6e/product/agreements/agreementV20180726/agreement_confirm.html?signed=1'
      }]
    }
  }
}
