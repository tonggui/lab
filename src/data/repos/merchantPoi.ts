import {
  Pagination
} from '../interface/common'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import _get from 'lodash/get'
import moment from 'moment'
import {
  getPoiList,
  getAllPoiList,
  submitAutoApproveStatus,
  getPoiSubscriptionInfoList,
  getPoiAuditProductStatistics,
  submitBatchUpdatePoiSubscriptionStatus,
  getPoiInfoListByIdList
} from '../merchantApi/poi'
import {
  getPoiList as getMedicinePoiList,
  getPoiInfoListByIdList as getMedicinePoiInfoListByIdList
} from '@/data/api/medicineMerchantApi/poi'
import {
  getBatchExcelTemplate,
  submitBatchCreateExcel,
  submitBatchModifyExcel,
  submitBatchUploadImage,
  submitBatchRel,
  batchRelConfirm
} from '../merchantApi/batch'
import { fetchDownloadTaskList, fetchRunningTask } from '../merchantApi/task'
import {
  convertTaskList as convertTaskListFromServer
} from '@/data/helper/product/merchant/convertFromServer'
import { downloadProductList } from '@/data/merchantApi/product'
import {
  getBatchExcelTemlateMap,
  submitMedicineCreateBatchRel,
  submitMedicineBatchModifyExcel,
  submitMedicineBatchCreateExcel
} from '../api/medicineMerchantApi/batchMenagement'
import { isAssociateMedicineMerchant } from '../../module/helper/utils'
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

export const fetchGetPoiList = async (keyword: string, pagination: Pagination, cityId: number) => {
  if (await isAssociateMedicineMerchant()) {
    return getMedicinePoiList({
      cityId,
      keyword,
      pagination
    })
  }
  return getPoiList({
    cityId,
    keyword,
    pagination
  })
}

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

/**
 * 商家商品中心审核数据
 */
export const fetchGetPoiAuditProductCount = async () => {
  const data = await getPoiAuditProductStatistics()
  // 审核中 + 审核驳回 + 纠错驳回 => 调整为 审核驳回 + 纠错驳回
  return data[PRODUCT_AUDIT_STATUS.AUDIT_REJECTED] + data[PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]
}

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

export const fetchGetCreateExcelTemplate = async () => {
  if (await isAssociateMedicineMerchant()) {
    return getBatchExcelTemlateMap()
      .then(data => pickExcelTemplate(data, ['mpcCreateWithUpc']))
  }
  return getBatchExcelTemplate()
    .then(data => pickExcelTemplate(data, ['hqccCreateWithUpc', 'hqccCreateWithCustom']))
}

export const fetchGetModifyExcelTemplate = async () => {
  if (await isAssociateMedicineMerchant()) {
    return getBatchExcelTemlateMap()
      .then(data => pickExcelTemplate(data, ['mpcUpdateTpl'], { extraLink: 'url' }))
  }
  return getBatchExcelTemplate()
    .then(data => pickExcelTemplate(data, ['hqccUpdateTpl'], { extraLink: 'url' }))
}

// 医药商家商品中心-批量删除关联商品-Excel模版
export const fetchGetDeleteRelExcelTemplate = () => getBatchExcelTemlateMap()
  .then(data => pickExcelTemplate(data, ['mpcDeleteRelTpl'], { extraLink: 'url' }))

export const fetchSubmitBatchCreateExcel = async (wmPoiIds: number[], file: File, fillPicBySp: boolean) => {
  if (await isAssociateMedicineMerchant()) {
    return submitMedicineBatchCreateExcel({
      wmPoiIds,
      file,
      fillPicBySp
    })
  }
  return submitBatchCreateExcel({
    wmPoiIds,
    file,
    fillPicBySp
  })
}
export const fetchSubmitBatchModifyExcel = async (wmPoiIds: number[], file: File, matchType: number) => {
  if (await isAssociateMedicineMerchant()) {
    return submitMedicineBatchModifyExcel({ wmPoiIds, file, matchType })
  }
  return submitBatchModifyExcel({ wmPoiIds, file, matchType })
}

export const fetchSubmitBatchUploadImage = (wmPoiIds: number[], file: File, picType: number, matchType: number) => submitBatchUploadImage({ wmPoiIds, file, picType, matchType })

export const fetchSubmitBatchRel = async (wmPoiIds: number[], syncTagList: object[]) => {
  if (await isAssociateMedicineMerchant()) {
    return submitMedicineCreateBatchRel({ wmPoiIds, syncTagList })
  }
  return submitBatchRel({ wmPoiIds, syncTagList })
}

export const fetchGetPoiInfoListByIdList = async (routerTagId: number, idList: number[]) => {
  if (await isAssociateMedicineMerchant()) {
    return getMedicinePoiInfoListByIdList({
      routerTagId,
      idList
    })
  }
  return getPoiInfoListByIdList({
    routerTagId,
    idList
  })
}

// 商品列表下载
export const fetchGetDownloadTaskList = async () => {
  const { list } = await fetchDownloadTaskList({
    pagination: ({ pageSize: 10, current: 1 }) as Pagination
  })
  return convertTaskListFromServer(list)
}

// 下载商品
export const fetchDownloadProduct = () => downloadProductList()

export const fetchGetRunningTask = (taskType) => fetchRunningTask({ taskType })

export const fetchBatchRelConfirm = (taskType) => batchRelConfirm({ taskType })
