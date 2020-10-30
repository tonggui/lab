import { PLATFORM } from '@/data/enums/common'
import {
  fetchUploadImgsDetail,
  fetchTaskList as ftl,
  fetchTaskDetail as ftd,
  fetchTaskMessage as ftm
} from '../api/task'
import {
  fetchTaskList as merchantFtl,
  fetchTaskDetail as merchantFtd,
  fetchTaskMessage as merchantFtm
} from '../merchantApi/task'
import { TYPE } from '@/views/progress/constants'
import { Pagination } from '../interface/common'
import { isMedicine } from '@/common/app'

export const fetchTaskList = ({ platform = PLATFORM.PRODUCT, pageSize, current, ...rest }) => {
  if (platform === PLATFORM.MERCHANT) {
    return merchantFtl({
      pagination: { pageSize, current } as Pagination,
      type: rest.type
    })
    // 多门店管理-任务进度
  } else if (platform === PLATFORM.MULTI_STORE_MANAGEMENT) {
    return ftl({
      pagination: { pageSize, current } as Pagination,
      ...rest as any
    })
  } else {
    const params = Object.assign({}, rest, { pageSize, current }) as Pagination
    return ftl({
      pagination: params,
      ...rest as any
    })
  }
}

export const fetchGetDownloadTaskList = (pagination : Pagination) => {
  const type = isMedicine() ? 3 : 6
  return fetchTaskList({ ...pagination, type }).then(({ list }) => list)
}

export const fetchTaskDetail = (platform = PLATFORM.PRODUCT, taskId, taskType) => {
  if (platform === PLATFORM.MERCHANT) {
    return merchantFtd(taskId)
  } else {
    if (taskType === TYPE['UPLOAD_IMGS']) { // 查看上传详情
      return fetchUploadImgsDetail(taskId)
    } else if (taskType === TYPE['UPDATE'] || taskType === TYPE['EXPORT'] || taskType === TYPE['DELETE'] || taskType === TYPE['SYNC']) { // 查看 2批量修改、3批量导出、4批量删除、5批量同步 详情
      return ftd(taskId)
    }
  }
}

export const fetchTaskMessage = (platform = PLATFORM.PRODUCT, taskId) => {
  if (platform === PLATFORM.MERCHANT) {
    return merchantFtm(taskId)
  } else {
    return ftm(taskId)
  }
}

export {
  fetchTaskPois
} from '../api/task'
