import httpClient from '../client/instance/product'
import {
  Pagination
} from '../interface/common'
import {
  convertTaskList as convertTaskListFromServer
} from '../helper/common/convertFromServer'

/**
 * 获取处理进度页的任务列表
 */
export const fetchTaskList = ({ pagination, type } :{ pagination: Pagination, type? }) => httpClient.post('task/r/list', {
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
 * 跨店处理进度查看目标门店
 */
export const fetchTaskPois = taskId =>
  httpClient.post('task/r/target_pois', {
    taskId
  })

/**
 * 获取处理进度页面的图片上传详情
 */
export const fetchUploadImgsDetail = taskId =>
  httpClient.post('task/r/details/uploadImgs', {
    taskId
  })

/**
 * 获取处理进度页面的批量修改、导出、删除、同步详情
 */
export const fetchTaskDetail = taskId =>
  httpClient.post('task/r/details', {
    taskId
  })

/**
 * 跨店处理进度查看异常汇总
 */
export const fetchTaskMessage = taskId =>
  httpClient.post('task/r/message', {
    taskId
  })
