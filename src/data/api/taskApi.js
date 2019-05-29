import client from './client'

/**
 * 获取处理进度页面的任务列表
 */
export const fetchTaskList = params =>
  client.post('task/r/list', params).then(data => {
    return data
  })

/**
 * 获取处理进度页面的图片上传详情
 */
export const fetchUploadImgsDetail = taskId =>
  client.post('task/r/details/uploadImgs', {
    taskId
  }).then(data => {
    return data
  })

/**
 * 获取处理进度页面的批量修改、导出、删除、同步详情
 */
export const fetchTaskDetail = taskId =>
  client.post('task/r/details', {
    taskId
  }).then(data => {
    return data
  })
