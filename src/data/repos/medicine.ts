import { getProductInfo, saveProductInfo, getSpUpdateInfo } from '../api/medicine'
import { MedicineDetailProduct } from '../interface/product'

export const fetchGetProductInfo = (spuId: number, poiId: number) => getProductInfo({ spuId, poiId })

export const fetchSaveProductInfo = (product: MedicineDetailProduct, poiId: number) => saveProductInfo({ product, poiId })

export const fetchGetSpUpdateInfo = (spuId: number, poiId: number) => getSpUpdateInfo({ spuId, poiId })