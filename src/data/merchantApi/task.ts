import httpClient from '../client/instance/merchant'
import {
  Pagination
} from '../interface/common'
import {
  convertMerchantTaskList as convertTaskListFromServer
} from '../helper/common/convertFromServer'

/**
 * 获取处理进度页的任务列表
 */
export const fetchTaskList = ({ pagination, type } : { pagination: Pagination, type? }) => httpClient.post('hqcc/r/listTaskResult', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  type
}).then(data => {
  data = data || {}
  return {
    pagination: {
      ...pagination,
      total: data.totalSize,
    },
    list: convertTaskListFromServer(data.data)
  }
})

/**
 * 处理进度页 查看任务详情
 */
export const fetchTaskDetail = taskId =>
  httpClient.post('hqcc/r/detailTaskResult', {
    taskId
  })

/**
 * 处理进度页 查看异常详情
 */
export const fetchTaskMessage = taskId =>
  httpClient.post('hqcc/r/detailErrorResult', {
    taskId
  })
