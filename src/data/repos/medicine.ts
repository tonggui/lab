import { getProductInfo } from '../api/medicine'

export const fetchGetProductInfo = (spuId: number, poiId: number) => getProductInfo({ spuId, poiId })