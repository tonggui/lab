import httpClient from '@/data/client/instance/merchant'

/**
 * 魔方创建任务进度
 * @param taskType
 */
export const apiCubeTaskStatus = ({ taskType }) => httpClient.post('/hqcc/r/cubeRunningTask', {
  taskType
}).then(data => {
  const {
    id,
    status,
    processStatusVo,
    finishStatusVo
  } = (data || {}) as any
  return {
    id,
    status,
    processStatus: processStatusVo,
    processResult: finishStatusVo
  }
})
