import {
  Pagination
} from '../interface/common'
import {
  getSpInfoByUpc,
  getHotSpList,
  getSpList,
  submitSpErrorRecovery,
  getSpInfoById,
  getSpUpdateInfoById
} from '../api/standardProduct'

export {
  submitBatchSaveProductBySp as fetchSubmitBatchSaveProductBySp
} from '../api/standardProduct'

export const fetchGetSpInfoByUpc = (upc: string|number) => getSpInfoByUpc({ upc })

export const fetchGetHotSpList = (pagination: Pagination, sortType, { name, upc, brandId, categoryId }, poiId: number) => getHotSpList({
  poiId,
  pagination,
  name,
  upc,
  brandId,
  categoryId,
  sortType
})

export const fetchGetSpList = (pagination: Pagination, sortType, { name, upc, brandId, categoryId }, poiId: number) => getSpList({
  poiId,
  pagination,
  name,
  upc,
  brandId,
  categoryId,
  sortType
})

export const fetchSubmitSpErrorRecovery = (spuId: number, fieldList, poiId: number) => submitSpErrorRecovery({
  poiId,
  spuId,
  fieldList
})

export const fetchGetSpInfoById = (id) => getSpInfoById({ id })

export const fetchGetSpUpdateInfoById = (id) => getSpUpdateInfoById({ id })

