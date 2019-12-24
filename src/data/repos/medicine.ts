import { getProductInfo, saveProductInfo } from '../api/medicine'
import { MedicineDetailProduct } from '../interface/product'

export const fetchGetProductInfo = (spuId: number, poiId: number) => getProductInfo({ spuId, poiId })

export const fetchSaveProductInfo = (product: MedicineDetailProduct, poiId: number) => saveProductInfo({ product, poiId })