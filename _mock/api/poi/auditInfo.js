/**
 * @url reuse/sc/product/shangou/cube/r/poiStatusInfo
*/
const map = [{
  content: '⻔店其他信息审核通过后，方可提交商品审核。'
}, {
  content: '至少创建5个商品才可提交审核。'
}, {
  title: '商品审核中，请耐心等待',
  content: '商品审核期间不可编辑，审核通过后可继续创建。'
}, {
  content: '审核未通过，请修改后重新提交，'
}, {}]
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: {
      auditStatus: 4,
      // "auditStatus|1": [0, 1, 2, 3, 4],
      bizDays: 61,
      onlineDayLimit: 60,
      ...map[1],
      // title: "@ctitle(10, 20)",
      // content: "@ctitle(20, 30)",
      rejectReason: "@ctitle(40, 50)"
    }
  }
}
