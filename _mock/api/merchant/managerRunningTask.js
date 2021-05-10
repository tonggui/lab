/**
 * @url reuse/sc/product/hqcc/manage/r/runningTask
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    taskId: -1,
    status: 60, // 10, 20, 60
    poiProgress: [{
      poiId: '1',
      status: 0
    }],
    taskName: '新疆',
    poiCount: 100,
    poiTaskDoneCount: 100,
    productCount: 20,
    ctime: +new Date(),
    resultUrl: '',
    resultDesc: '全部关联成功，共 300 个商品关联至 800 个门店',
    resultStatus: 301
  }
}
