import httpClient from '../client/instance/merchant'
import {
  Pagination
} from '../interface/common'
import {
  convertPoiList as convertPoiListFromServer
} from '../helper/poi/convertFromServer'

export const getPoiList = ({ keyword, cityId, pagination }: {
  keyword: string,
  cityId: number,
  pagination: Pagination
}) => httpClient.post('hqcc/r/listPaddingPoi', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  name: keyword,
  cid: cityId
}).then(data => {
  const { list, total } = (data || {}) as any
  return {
    list: convertPoiListFromServer(list),
    pagination: {
      ...pagination,
      total: total || 0
    }
  }
})

export const getIsMerchant = () => httpClient.post('hqcc/r/isHeadquarter').then(data => !!data)

export const getAllPoiList = ({ keyword, cityId, exclude }: {
  keyword: string,
  cityId: number,
  exclude: number[]
}) => httpClient.post('hqcc/r/listAllPaddingPoi', {
  name: keyword,
  cid: cityId,
  excludePoiIds: exclude
}).then(data => {
  const { list } = (data || {}) as any
  return convertPoiListFromServer(list || [])
})

export const getUnApproveProductCount = (): number => httpClient.post('hqcc/r/getProductCount').then(data => {
  const { unIncludeCount } = (data || {}) as any
  return unIncludeCount || 0
})

export const getAutoApproveStatus = (): boolean => httpClient.post('hqcc/r/autoIncludeStatus').then(data => {
  const { autoIncludeStatus } = (data || {}) as any
  // 开关状态 1 开 2关
  return autoIncludeStatus === 1
})

export const submitAutoApproveStatus = ({ status }: { status: boolean }) => httpClient.post('hqcc/w/setAutoInclude', {
  // 开关状态 1 开 2关
  autoIncludeStatus: status ? 1 : 2
})

export const getPoiSizeConfig = () => httpClient.post('hqcc/r/getPoiSizeConfig')
