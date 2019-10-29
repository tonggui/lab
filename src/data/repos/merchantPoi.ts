import {
  Pagination
} from '../interface/common'
import {
  getPoiList,
  submitAutoApproveStatus,
} from '../merchantApi/poi'
export {
  getUnApproveProductCount as fetchGetUnApproveProductCount,
  getAutoApproveStatus as fetchGetAutoApproveStatus,
} from '../merchantApi/poi'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})

export const fetchSubmitAutoApproveStatus = (status: boolean) => submitAutoApproveStatus({ status })
