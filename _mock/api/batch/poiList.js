/**
 * @url /reuse/sc/product/sync_food/async/r/poi_paging
 */
module.exports = function (req) {
  const list = `list|${req.body.pageSize}`
  // const list = `list|3`
  const pageNum = +req.body.pageNum;
  const pageSize = +req.body.pageSize;
  const names = Array.from(Array(pageSize), (_i, i) => {
    return req.body.name + '~~~' + (i + (pageNum - 1) * pageSize);
  })
  return {
    msg: '',
    code: 0,
    data: {
      pageNum: +req.body.pageNum || 0,
      pageSize: +req.body.pageSize || 20,
      total: 1000,
      // list: [],
      // "list|3": [{
      [list]: [{
        "id|+1": +req.body.pageNum * req.body.pageSize + 1,
        "name|+1": names,
        address: '@region',
        wmPoiId: '@guid'
      }]
    }
  }
}
