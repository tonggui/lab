/**
 * @url reuse/sc/product/hqcc/cube/r/cubeRunningTask
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    taskId: -1,
    taskName: '魔方任务',
    status: 60,
    runningStatusVo: {
      runningStatus: 202,
      mainSpuProcessStatusVo: {
        finishedNum: 20,
        totalNum: 20
      },
      poiAsyncProcessStatusVo: {
        finishedNum: 10,
        totalNum: 20
      }
    },
    finishStatusVo: {
      finishStatus: 600,
      succeedMainSpuNum: 10,
      failedMainSpuNum: 14,
      succeedMainSpuDetails: [],
      failedMainSpuDetails: [],
      failedUrl: '212121'
    }
  }
}
