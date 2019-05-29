import client from './client'

/**
 * 获取处理进度页面的任务列表
 */
export const fetchTaskList = params =>
  client.post('task/r/list', params).then(data => {
    return data
  })
