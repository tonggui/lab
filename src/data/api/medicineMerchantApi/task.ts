import httpClient from '@/data/client/instance/medicineMerchant'
import {
  Pagination
} from '@/data/interface/common'

import {
  convertTaskList as convertMerchantTaskListFromServer
} from '@/data/helper/product/merchant/convertFromServer'

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
