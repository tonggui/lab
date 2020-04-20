import { getProductInfo, saveProductInfo, getSpUpdateInfo, getCategoryAttrs } from '../api/medicine'
import { MedicineDetailProduct } from '../interface/product'

export const fetchGetMedicineCategoryAttrList = (poiId: number, categoryId: number, future = false) => getCategoryAttrs({ poiId, categoryId }, future)

export const fetchGetProductInfo = (spuId: number, poiId: number) => getProductInfo({ spuId, poiId })

export const fetchSaveProductInfo = (product: MedicineDetailProduct, poiId: number) => saveProductInfo({ product, poiId })

export const fetchGetSpUpdateInfo = (spuId: number, poiId: number) => getSpUpdateInfo({ spuId, poiId })
