import client from './client'

/**
 * 获取处理进度页面的任务列表
 */
export const fetchTaskList = params =>
  client.post('task/r/list', params).then(res => {
    return {
      taskList: res.data,
      totalNum: res.totalSize
    }
  })

/**
 * 跨店处理进度查看目标门店
 */
export const fetchTaskPois = taskId =>
  client.post('task/r/target_pois', {
    taskId
  })

/**
 * 获取处理进度页面的图片上传详情
 */
export const fetchUploadImgsDetail = taskId =>
  client.post('task/r/details/uploadImgs', {
    taskId
  })

/**
 * 获取处理进度页面的批量修改、导出、删除、同步详情
 */
export const fetchTaskDetail = taskId =>
  client.post('task/r/details', {
    taskId
  })

/**
 * 跨店处理进度查看异常汇总
 */
export const fetchTaskMessage = taskId =>
  client.post('task/r/message', {
    taskId
  })
