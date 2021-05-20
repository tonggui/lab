/**
 * @url /reuse/sc/product/permission/r/getProductPermissionId
 */
module.exports = function (req) {
  const wmPoiId = +req.body.wmPoiId
  const spuId = +req.body.spuId
  return {
    code: 0,
    msg: '',
    data: {
      permissionIdList:[-999]
    }
  }
};
