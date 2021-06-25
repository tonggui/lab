/**
 * @url reuse/sc/product/hqcc/cube/r/cubeRunningTask
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    cubeTaskStatus: {
      taskId: -1,
      taskName: '212',
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
        finishStatus: 300,
        succeedMainSpuNum: 10,
        failedMainSpuNum: 14,
        succeedMainSpuDetails: [],
        failedMainSpuDetails: [],
        failedUrl: '212121'
      }
    }
  }
}
