import {
  Pagination
} from '../interface/common'
import {
  getPoiList
} from '../merchantApi/poi'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})
