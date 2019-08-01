import {
  Pagination
} from '../interface/common'
import {
  getProductList,
  getProductDetail,
  getSpChangeInfo,
  submitProductInfo,
  submitIncludeProduct,
  getSearchSuggestion,
  submitModProductSellStatus,
  submitDeleteProduct,
  submitSaveOrder,
  submitSaveOrderWithSync,
  getProductRelPoiList,
  submitClearRelPoi,
  submitPoiProductSellStatus,
  submitAddRelPoi
} from '../merchantApi/product'
import {
  convertTagListSort as convertTagListSortToServer
} from '../helper/category/convertToServer'
import {
  PRODUCT_SELL_STATUS
} from '../enums/product'
import {
  Tag
} from '../interface/category'
import { Product } from '../interface/product'

export {
  getCategoryAttrSwitch as fetchGetCategoryAttrSwitch,
  submitDownloadProduct as fetchSubmitDownloadProduct,
  getDownloadTaskList as fetchGetDownloadTaskList
} from '../merchantApi/product'

export const fetchGetSearchSuggestion = (keyword: string) => getSearchSuggestion({ keyword })

export const fetchGetProductList = (tagId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, needTags: 2 })
}

export const fetchGetIncludeProductList = (tagId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 2, needTags: 1 })
}

export const fetchGetProductListBySearch = (tagId: number, keyword: string, brandId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, keyword, needTags: 1, brandId: brandId || 0 })
}

export const fetchGetProductDetail = (spuId: number) => getProductDetail({ spuId })

export const fetchSaveOrUpdateProduct = (product: Product) => submitProductInfo(product)

export const fetchSubmitIncludeProduct = (spuIdList: number[]) => submitIncludeProduct({ spuIdList })

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => submitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitDeleteProduct = (idList: number[]) => submitDeleteProduct({ idList })

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), wmPoiIds: poiIdList })

export const fetchGetProductRelPoiList = (spuId: number, pagination: Pagination, poiId: number) => getProductRelPoiList({ pagination, spuId, poiId })

export const fetchSubmitClearRelPoi = (spuId: number, poiId: number) => submitClearRelPoi({
  spuId,
  poiId
})

export const fetchSubmitPoiProductSellStatus = (spuId: number, poiId: number, sellStatus: PRODUCT_SELL_STATUS) => submitPoiProductSellStatus({
  spuId,
  poiId,
  sellStatus
})
export const fetchSubmitAddRelPoi = (spuId: number, poiIdList: number[]) => submitAddRelPoi({
  spuId,
  poiIdList
})
export const fetchGetSpChangeInfo = (spuId: number) => getSpChangeInfo({ spuId })
