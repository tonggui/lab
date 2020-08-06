import {
  Pagination
} from '../interface/common'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import {
  getPoiList,
  getAllPoiList,
  submitAutoApproveStatus,
  getPoiSubscriptionInfoList,
  submitBatchUpdatePoiSubscriptionStatus,
  getPoiAuditProductStatistics
} from '../merchantApi/poi'
export {
  getUnApproveProductCount as fetchGetUnApproveProductCount,
  getAutoApproveStatus as fetchGetAutoApproveStatus,
} from '../merchantApi/poi'
export {
  getIsMerchant as fetchGetIsMerchant,
  getPoiSizeConfig as fetchGetPoiSizeConfig
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

export const fetchGetPoiSubscriptionInfoList = (pagination: Pagination, filters: { keyword: string }) => getPoiSubscriptionInfoList({ ...filters, pagination })

export const fetchSubmitBatchUpdatePoiSubscriptionStatus = (status: boolean, poiIdList: number[], isAll: boolean, filters?: { keyword: string }) => submitBatchUpdatePoiSubscriptionStatus({
  status,
  poiIdList,
  isAll,
  ...filters
})

export const fetchSubmitUpdatePoiSubscriptionStatus = (status: boolean, poiId: number) => fetchSubmitBatchUpdatePoiSubscriptionStatus(status, [poiId], false)

export const fetchSubmitUpdateAllPoiSubscriptionStatus = (status: boolean) => submitBatchUpdatePoiSubscriptionStatus({
  status,
  poiIdList: [],
  isAll: true
})

export const fetchGetPoiAuditProductStatistics = () => getPoiAuditProductStatistics()

export const fetchGetPoiAuditProductCount = async () => {
  const data = await getPoiAuditProductStatistics()
  // 审核中 + 审核驳回 + 纠错驳回
  return data[PRODUCT_AUDIT_STATUS.AUDITING] + data[PRODUCT_AUDIT_STATUS.AUDIT_REJECTED] + data[PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]
}
