import {
  fetchUploadImgsDetail,
  fetchTaskDetail as ftd
} from '../api/taskApi'

export const fetchTaskDetail = (taskId, taskType) => {
  if (taskType === 7) { // 查看上传详情
    return fetchUploadImgsDetail(taskId)
  } else if (taskType === 2 || taskType === 3 || taskType === 4 || taskType === 5) { // 查看 2批量修改、3批量导出、4批量删除、5批量同步 详情
    return ftd(taskId)
  }
}

export {
  fetchTaskList,
  fetchTaskPois,
  fetchTaskMessage
} from '../api/taskApi'
