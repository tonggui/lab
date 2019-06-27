import {
  fetchUploadImgsDetail,
  fetchTaskDetail as ftd
} from '../api/taskApi'
import { TYPE } from '@/views/progress/constants'

export const fetchTaskDetail = (taskId, taskType) => {
  if (taskType === TYPE['UPLOAD_IMGS']) { // 查看上传详情
    return fetchUploadImgsDetail(taskId)
  } else if (taskType === TYPE['UPDATE'] || taskType === TYPE['EXPORT'] || taskType === TYPE['DELETE'] || taskType === TYPE['SYNC']) { // 查看 2批量修改、3批量导出、4批量删除、5批量同步 详情
    return ftd(taskId)
  }
}

export {
  fetchTaskList,
  fetchTaskPois,
  fetchTaskMessage
} from '../api/taskApi'
