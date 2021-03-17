/**
 * @url reuse/sc/product/hqcc/r/runingTask
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
    poiCount: 100,
    poiTaskDoneCount: 80,
    ctime: +new Date(),
    resultUrl: '',
    resultDesc: '完成了',
    resultStatus: 300
  }
}
