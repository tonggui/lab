/*
* @url /reuse/sc/product/food/r/getWmPoiAuditInfo
*/
module.exports = function () {
  return {
    msg: '',
    code: 0,
    data: {
      status: 4, // 0, 1, 2, 3, 4
      msg: 'statusMsg',
      showSubmitPic: "@boolean"
    }
  };
}
