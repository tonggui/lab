/**
 * @url /reuse/sc/product/retail/sync/task/r/progress
 */
module.exports = {
  msg: '',
  code: 0,
  data: {
    pageNum: 1,
    pageSize: 20,
    totalPage: 10,
    totalSize: 100,
    "data|20": [{
      branchPoiId: '@uuid',
      branchPoiName: '@cname',
      "status|1": [0, 1],
    }] 
  }
};
