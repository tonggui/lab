import {
  Pagination
} from '../interface/common'

import {
  getPoiList,
  getPoiInfoListByIdList,
  getAllPoiList,
  getConfig
} from '../api/medicineMerchantApi/poi'

export {
  getMerchantCommonInfo as fetchGetMerchantInfo
} from '../api/medicineMerchantApi/poi'

export {
  fetchTaskRelPoiList as fetchGetTaskRelPoiList
} from '../api/medicineMerchantApi/task'

import { fetchDownloadTaskList, downloadProductList } from '../api/medicineMerchantApi/task'

import {
  convertTaskList as convertTaskListFromServer
} from '@/data/helper/product/merchant/convertFromServer'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})

export const fetchGetPoiInfoListByIdList = (routerTagId: number, idList: number[]) => getPoiInfoListByIdList({
  routerTagId,
  idList
})

export const fetchGetAllPoiList = (keyword: string, cityId: number, exclude: number[]) => getAllPoiList({
  cityId,
  keyword,
  exclude
})

// 商品下载列表
export const fetchGetDownloadTaskList = async () => {
  const { list } = await fetchDownloadTaskList({
    pagination: ({ pageSize: 10, current: 1 }) as Pagination
  })
  return convertTaskListFromServer(list)
}

// 添加下载商品
export const fetchDownloadProduct = () => downloadProductList()

// 获取编辑页配置信息
export const fetchGetConfig = (categoryId: number) => getConfig({ categoryId })