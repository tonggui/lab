import httpClient from '@/data/client/instance/medicineMerchant'
import {
  Pagination
} from '@/data/interface/common'

import {
  convertTaskList as convertMerchantTaskListFromServer
} from '@/data/helper/product/merchant/convertFromServer'

import {
  convertTaskList as convertTaskListFromServer
} from '@/data/helper/common/convertFromServer'

/**
 * 获取处理进度页的任务列表
 */
export const fetchDownloadTaskList = ({ pagination } : { pagination: Pagination }) => httpClient.post('download/r/listProductTask', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current
}).then(data => {
  data = data || {}
  return {
    pagination: {
      ...pagination,
      total: data.totalSize
    },
    list: convertMerchantTaskListFromServer(data.list)
  }
})

// 添加下载 医药商家商品中心商品 任务
export const downloadProductList = () => httpClient.post('download/w/addProductTask')

/**
 * 获取处理进度页的任务列表
 */
export const fetchTaskList = ({ pagination, type } : { pagination: Pagination, type? }) => httpClient.post('r/listTaskResult', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  type
}).then(data => {
  data = data || {}
  return {
    pagination: {
      ...pagination,
      total: data.totalCount
    },
    list: convertTaskListFromServer(data.list)
  }
})

/**
 * 处理进度页 查看任务详情
 */
export const fetchTaskDetail = taskId =>
  httpClient.post('r/detailTaskResult', {
    taskId
  })

/**
 * 处理进度页 查看异常详情
 */
export const fetchTaskMessage = taskId =>
  httpClient.post('r/detailErrorResult', {
    taskId
  })

/**
 * 处理进度页 查看异常详情
 */
export const fetchTaskRelPoiList = taskId =>
  httpClient.post('r/taskRelPois', {
    taskId
  }).then(({ list }) => list.map(({ ownerUname, ...others }) => ({
    ...others,
    ownerName: ownerUname
  })))
