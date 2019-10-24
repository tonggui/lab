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

export const fetchGetSpInfoByUpc = (upc: string|number, poiId: string|number) => getSpInfoByUpc({ upc, poiId })

export const fetchGetHotSpList = (params) => getHotSpList(params)

export const fetchGetSpList = (params) => getSpList(params)

export const fetchSubmitSpErrorRecovery = (spuId: number, fieldList, poiId: number) => submitSpErrorRecovery({
  poiId,
  spuId,
  fieldList
})

export const fetchGetSpInfoById = (id, poiId) => getSpInfoById({ id, poiId })

export const fetchGetSpUpdateInfoById = (id, poiId) => getSpUpdateInfoById({ id, poiId })
