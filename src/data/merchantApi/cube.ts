import httpClient from '@/data/client/instance/merchant'

/**
 * 魔方创建任务进度
 * @param taskType
 */
export const apiCubeTaskStatus = ({ taskType = 203 } : { taskType: number }) => httpClient.post('/hqcc/r/cubeRunningTask', {
  taskType
}).then(({ cubeTaskStatus }) => {
  const {
    taskId,
    status,
    runningStatusVo,
    finishStatusVo: processResult = {},
    submitTime
  } = (cubeTaskStatus || {}) as any

  const {
    runningStatus,
    mainSpuProcessStatusVo: mainStatus,
    poiAsyncProcessStatusVo: poiStatus
  } = (runningStatusVo || {}) as any

  const {
    finishStatus: resultStatus,
    succeedMainSpuNum: succeedNum,
    failedMainSpuNum: failedNum,
    succeedMainSpuDetails: succeedList,
    failedMainSpuDetails: failedList,
    failedUrl
  } = (processResult || {}) as any

  return {
    taskId,
    status,
    submitTime,
    processStatus: {
      runningStatus,
      mainStatus: {
        succeedNum: mainStatus.finishedNum,
        totalNum: mainStatus.totalNum
      },
      poiStatus: {
        succeedNum: poiStatus.finishedNum,
        totalNum: poiStatus.totalNum
      }
    },
    processResult: {
      resultStatus,
      succeedNum,
      failedNum,
      succeedList,
      failedList,
      failedUrl
    }
  }
})

/***
 * 确认魔方创建任务
 * @param taskId
 */
export const apiCubeTaskConfirm = ({ taskId } : { taskId: number }) => httpClient.post('/hqcc/r/cubeRunningTaskConfirm', { taskId })
