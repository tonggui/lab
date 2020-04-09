import {
  Pagination
} from '../interface/common'
import {
  getPoiType,
  getPoiTipList,
  getPoiAuditInfo,
  submitPoiAudit,
  getPoiRiskControl,
  getPoiAgreementInfo,
  submitPoiAgreement,
  getListPageData,
  getPoiList,
  getMultiPoiTagInfo,
  getMultiPoiIsSingleTag,
  getPoiInfoById,
  getPoiInfoListByExcludeIdList,
  getPoiInfoListByIdList,
  getPoiHotRecommend,
  getPoiViolationInfo,
  getWhiteListModuleMap,
  getWhiteListFieldMap,
  getPackageBagPrice,
  submitPackageBagPrice,
  getFieldVisibleConfig,
  getFunctionConfig,
  getPoiBusinessTemplateInfo,
  getPoiAutoClearStockConfig,
  submitPoiAutoClearStockConfig,
  getPoiAuditProductStatistics,
  getCellularProductTaskInfo
} from '../api/poi'

export const fetchGetPoiType = (poiId: number) => getPoiType({ poiId })
export const fetchGetPoiTipList = (poiId: number) => getPoiTipList({ poiId })
export const fetchGetPoiAuditInfo = (poiId: number) => getPoiAuditInfo({ poiId })
export const fetchSubmitPoiAudit = (poiId: number) => submitPoiAudit({ poiId })
export const fetchGetPoiRiskControl = (poiId: number) => getPoiRiskControl({ poiId })
export const fetchGetPoiAgreementInfo = (poiId: number) => getPoiAgreementInfo({ poiId })
export const fetchSubmitPoiAgreement = (poiId: number) => submitPoiAgreement({ poiId })
export const fetchGetListPageData = (poiId: number) => getListPageData({ poiId })
export const fetchGetPoiHotRecommend = (poiId: number) => getPoiHotRecommend({ poiId })
export const fetchGetPoiViolationInfo = (poiId: number) => getPoiViolationInfo({ poiId })
export const fetchGetWhiteListModuleMap = (poiId: number) => getWhiteListModuleMap({ poiId })
export const fetchGetWhiteListFieldMap = (poiId: number) => getWhiteListFieldMap({ poiId })
export const fetchGetFieldVisibleConfig = (poiId: number) => getFieldVisibleConfig({ poiId })
export const fetchGetFunctionConfig = (poiId: number) => getFunctionConfig({ poiId })

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number, routerTagId: number) => getPoiList({
  cityId,
  routerTagId,
  keyword,
  pagination
})

export const fetchGetMultiPoiTagInfo = (routerTagId: number) => getMultiPoiTagInfo({ routerTagId })

export const fetchGetMultiPoiIsSingleTag = (routerTagId: number) => getMultiPoiIsSingleTag({ routerTagId })

export const fetchGetPoiInfoById = (poiId: number, routerTagId: number, isBrand: boolean) => getPoiInfoById({
  poiId,
  routerTagId,
  isBrand
})

export const fetchGetPoiInfoListByExcludeIdList = (routerTagId: number, headPoiId: number, idList: number[], isBrand: boolean) => getPoiInfoListByExcludeIdList({
  headPoiId,
  routerTagId,
  isBrand,
  idList
})

export const fetchGetPoiInfoListByIdList = (routerTagId: number, idList: number[]) => getPoiInfoListByIdList({
  routerTagId,
  idList
})

export const fetchGetPackageBagPrice = (poiId: number) => getPackageBagPrice({ poiId })

export const fetchSubmitPackageBagPrice = (price: number, poiId: number) => submitPackageBagPrice({ poiId, price })

export const fetchGetPoiBusinessTemplateInfo = (poiId: number) => getPoiBusinessTemplateInfo({ poiId })

export const fetchGetPoiAutoClearStockConfig = (poiId: number) => getPoiAutoClearStockConfig({ poiId })

export const fetchSubmitPoiAutoClearStockConfig = (status: boolean, config: object, productMap: { [propname: string]: object }, poiId: number) => submitPoiAutoClearStockConfig({
  poiId,
  status,
  productMap,
  config
})

export const fetchGetPoiAuditProductStatistics = (poiId: number) => getPoiAuditProductStatistics({ poiId })

export const fetchGetCellularProductTaskInfo = (spuId: number, poiId: number) => getCellularProductTaskInfo({ poiId, spuId })
