import {
  Pagination
} from '../interface/common'

import {
  getPoiList,
  getPoiInfoListByIdList
} from '../medicineMerchantApi/poi'

export {
  getMerchantCommonInfo as fetchGetMerchantInfo
} from '../medicineMerchantApi/poi'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})

export const fetchGetPoiInfoListByIdList = (routerTagId: number, idList: number[]) => getPoiInfoListByIdList({
  routerTagId,
  idList
})