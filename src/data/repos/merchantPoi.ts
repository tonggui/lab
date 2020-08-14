import {
  Pagination
} from '../interface/common'
import _get from 'lodash/get'
import moment from 'moment'
import {
  getPoiList,
  getAllPoiList,
  submitAutoApproveStatus,
  getPoiSubscriptionInfoList,
  submitBatchUpdatePoiSubscriptionStatus,
  getPoiInfoListByIdList
} from '../merchantApi/poi'
import {
  getBatchExcelTemplate,
  submitBatchCreateExcel,
  submitBatchModifyExcel,
  submitBatchUploadImage,
  submitBatchRel
} from '../merchantApi/batch'
export {
  getUnApproveProductCount as fetchGetUnApproveProductCount,
  getAutoApproveStatus as fetchGetAutoApproveStatus
} from '../merchantApi/poi'
export {
  getIsMerchant as fetchGetIsMerchant,
  getPoiSizeConfig as fetchGetPoiSizeConfig,
  getMerchantCommonInfo as fetchGetMerchantInfo
} from '../merchantApi/poi'
export {
  fetchTaskRelPoiList as fetchGetTaskRelPoiList
} from '../merchantApi/task'

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

const pickExcelTemplate = (source, keyList, mapper = {}) => keyList.map(key => {
  const config = _get(source, key)
  if (config) {
    return {
      link: config.url,
      time: moment(config.meta.lastModifyTime).format('YYYY-MM-DD'),
      ...Object.entries(mapper).map(([key, value]) => {
        let convertValue: any
        if (typeof value === 'string') {
          convertValue = source[key]
        } else if (typeof value === 'function') {
          convertValue = value(key, source)
        }
        return [key, convertValue]
      }).reduce((map, [key, value]) => ({
        [key]: value,
        ...map
      }), {})
    }
  }
}).filter(item => !!item)

export const fetchGetCreateExcelTemplate = () => getBatchExcelTemplate()
  .then(data => pickExcelTemplate(data, ['createWithEan', 'createWithoutEan']))

export const fetchGetModifyExcelTemplate = () => getBatchExcelTemplate()
  .then(data => pickExcelTemplate(data, ['updateTpl'], { extraLink: 'url' }))

export const fetchSubmitBatchCreateExcel = (wmPoiIds: number[], file: File, fillPicBySp: boolean) => submitBatchCreateExcel({
  wmPoiIds,
  file,
  fillPicBySp
})
export const fetchSubmitBatchModifyExcel = (wmPoiIds: number[], file: File, matchType: number) => submitBatchModifyExcel({ wmPoiIds, file, matchType })

export const fetchSubmitBatchUploadImage = (wmPoiIds: number[], file: File, picType: number, matchType: number) => submitBatchUploadImage({ wmPoiIds, file, picType, matchType })

export const fetchSubmitBatchRel = (wmPoiIds: number[], syncTagList: object[]) => submitBatchRel({ wmPoiIds, syncTagList })

export const fetchGetPoiInfoListByIdList = (idList: number[]) => getPoiInfoListByIdList({ idList })
