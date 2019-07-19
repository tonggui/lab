import {
  getPoiList
} from '../merchantApi/poi'
import {
  Pagination
} from '../interface/common'

export const fetchGetPoiList = (keyword: string, pagination: Pagination, cityId: number) => getPoiList({
  cityId,
  keyword,
  pagination
})
