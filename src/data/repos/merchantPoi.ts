import {
  Pagination
} from '../interface/common'
import {
  getPoiList,
  getAllPoiList,
  submitAutoApproveStatus,
} from '../merchantApi/poi'
export {
  getUnApproveProductCount as fetchGetUnApproveProductCount,
  getAutoApproveStatus as fetchGetAutoApproveStatus,
} from '../merchantApi/poi'
export {
  getIsMerchant as fetchGetIsMerchant
} from '../merchantApi/poi'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})

export const fetchGetAllPoiList = (keyword: string, cityId: number, exclude: number[]) => getAllPoiList({
  cityId,
  keyword,
  exclude
})

export const fetchSubmitAutoApproveStatus = (status: boolean) => submitAutoApproveStatus({ status })
