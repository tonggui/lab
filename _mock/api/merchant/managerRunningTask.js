/**
 * @url reuse/sc/product/hqcc/manage/r/runningTask
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    taskId: 20,
    status: 10, // 10, 20, 60
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
    resultDesc: '{}',
    resultStatus: 301
  }
}
