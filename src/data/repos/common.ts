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
  submitEvaluation
} from '../api/common'

export {
  getCityList as fetchGetCityList,
  submitApplyBrand as fetchSubmitApplyBrand,
  uploadImageByFile as fetchUploadImageByFile,
  getPageEnvInfo as fetchPageEnvInfo
} from '../api/common'

export const fetchUploadImageByBase64 = (file, name, poiIdList, score) => {
  return uploadImageByBase64({
    base64: file,
    name,
    score,
    poiId: isArray(poiIdList) ? (poiIdList.length !== 1 ? undefined : poiIdList[0]) : poiIdList
  })
}

export const fetchGetBrandByName = (keyword: string) => getBrandByName({ keyword })

export const fetchGetPictureListByName = (keyword: string, pagination: Pagination) => {
  return getPictureListByName({ keyword, pagination })
}

export const fetchGetTaskProgress = (taskId: number) => getTaskProgress({ taskId })

export const fetchCreateExcelTemplate = () => getExcelTemplateMap().then((data) => {
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
    time: moment(createWithoutEan.meta.lastModifyTime).format('YYYY-MM-DD')
  }]
})

export const fetchModifyExcelTemplate = () => getExcelTemplateMap().then((data) => {
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

export const fetchGetEvaluation = (pageType: number) => getEvaluation({ pageType })

export const fetchSubmitEvaluation = (pageType: number, likeType: number) => submitEvaluation({ pageType, likeType })