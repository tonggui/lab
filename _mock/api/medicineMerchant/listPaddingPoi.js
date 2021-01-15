/**
 * @url /reuse/mpc/product/r/listPaddingPoi
 */
module.exports = function (req) {
  const pageNum = +req.body.pageNum || 0;
  const pageSize = +req.body.pageSize || 20;
  const name = req.body.name || 'name'
  const list = `list|${pageSize}`
  const names = Array.from(Array(pageSize), (_i, i) => {
    return name + '~~~' + (i + (pageNum - 1) * pageSize);
  })
  return {
    msg: '',
    code: 0,
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      total: 1000,
      [list]: [{
        "id|+1": (pageNum - 1) * pageSize + 1,
        "name|+1": names,
        address: '@region',
        "wmPoiId|+1": (pageNum - 1) * pageSize,
      }]
    }
  }
}
