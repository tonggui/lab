import { isArray } from 'lodash'
import moment from 'moment'
import { isMedicine } from '@/common/app'
import {
  Pagination
} from '../interface/common'
import {
  uploadImageByBase64,
  getBrandByName,
  getPictureListByName,
  getTaskProgress,
  getExcelTemplateMap,
  getEvaluation,
  submitEvaluation,
  getMonitorPageInfo,
  getConfig,
  submitApplyBrand as submitApplyBrandFromPoi
} from '../api/common'

import { submitApplyBrand as submitApplyBrandFromMerchant } from '../merchantApi/product'

export {
  getCityList as fetchGetCityList,
  uploadImageByFile as fetchUploadImageByFile,
  getPageEnvInfo as fetchPageEnvInfo
} from '../api/common'

export const fetchMonitorPageInfo = (poiId: number) => getMonitorPageInfo({ poiId })
export const fetchSubmitApplyBrand = ({ isMerchant, poiId, name = '', logoPic = '', brandUrl = '' }) => {
  return isMerchant ? submitApplyBrandFromMerchant({ name, logoPic, brandUrl }) : submitApplyBrandFromPoi({ poiId, name, logoPic, brandUrl })
}

export const fetchUploadImageByBase64 = (file, name, poiIdList, score) => {
  return uploadImageByBase64({
    base64: file,
    name,
    score,
    poiId: isArray(poiIdList) ? (poiIdList.length !== 1 ? undefined : poiIdList[0]) : poiIdList
  })
}

export const fetchGetBrandByName = (keyword: string) => getBrandByName({ keyword })

export const fetchGetPictureListByName = (keyword: string, pagination: Pagination, wmPoiId?: number|string) => {
  return getPictureListByName({ keyword, pagination, wmPoiId })
}

export const fetchGetTaskProgress = (taskId: number) => getTaskProgress({ taskId })

export const fetchGetCreateExcelTemplate = () => getExcelTemplateMap().then((data) => {
  if (!data) {
    return []
  }
  const {
    createWithEan,
    createWithoutEan,
    // retailCategoryTpl,
    medicineCreateTpl
  } = data
  // TODO 药品处理逻辑
  // TODO 【医药B2C】商家建品流程调整 加判断条件，药品但非`createWithoutEan.meta.*`
  if (isMedicine()) {
    return [{
      link: medicineCreateTpl.url,
      time: moment(medicineCreateTpl.meta.lastModifyTime).format('YYYY-MM-DD')
    }]
  }
  return [{
    link: createWithEan.url,
    time: moment(createWithEan.meta.lastModifyTime).format('YYYY-MM-DD')
  }, {
    link: createWithoutEan.url,
    time: moment(createWithoutEan.meta.lastModifyTime).format('YYYY-MM-DD'),
    show: createWithoutEan.show || false
  }]
})

export const fetchGetModifyExcelTemplate = () => getExcelTemplateMap().then((data) => {
  if (!data) {
    return []
  }
  const { updateTpl, retailCategoryTpl, medicineModifyTpl } = data
  // TODO 药品处理逻辑
  if (isMedicine()) {
    return [{
      link: medicineModifyTpl.url,
      time: moment(medicineModifyTpl.meta.lastModifyTime).format('YYYY-MM-DD'),
      extraLink: retailCategoryTpl.url
    }]
  }
  return [{
    link: updateTpl.url,
    time: moment(updateTpl.meta.lastModifyTime).format('YYYY-MM-DD'),
    extraLink: retailCategoryTpl.url
  }]
})

export const fetchGetEvaluation = (pageType: number, poiId: number) => getEvaluation({ pageType, poiId })

export const fetchSubmitEvaluation = (pageType: number, likeType: number, poiId: number) => submitEvaluation({ pageType, likeType, poiId })

export const fetchGetConfig = (categoryId: number, poiId: number) => getConfig({ categoryId, poiId })
