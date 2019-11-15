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

import { wrapAkitaBusiness } from '@/common/akita'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'

/* Akita wrapper start */
const akitaWrappedSubmitModProductSellStatus = wrapAkitaBusiness(
  (params) => {
    const type = params.sellStatus ? TYPE.OFF_SHELF : TYPE.ON_SHELF
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(submitModProductSellStatus)
/* Akita wrapper end */

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

export const fetchSaveOrUpdateProduct = wrapAkitaBusiness(
  (product) => {
    const type = product.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(
  (product: Product) => submitProductInfo(product)
)

export const fetchSubmitIncludeProduct = (spuIdList: number[]) => submitIncludeProduct({ spuIdList })

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => akitaWrappedSubmitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitDeleteProduct = wrapAkitaBusiness(MODULE.MERCHANT_PRODUCT, TYPE.DELETE, true)(
  (idList: number[]) => submitDeleteProduct({ idList })
)

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), wmPoiIds: poiIdList })

export const fetchGetProductRelPoiList = (spuId: number, pagination: Pagination, poiId: number) => getProductRelPoiList({ pagination, spuId, poiId })

export const fetchSubmitClearRelPoi = (spuId: number, poiIdList: number[]) => submitClearRelPoi({
  spuId,
  poiIdList
})

export const fetchSubmitPoiProductSellStatus = (spuId: number, poiIdList: number[], sellStatus: PRODUCT_SELL_STATUS) => submitPoiProductSellStatus({
  spuId,
  poiIdList,
  sellStatus
})
export const fetchSubmitAddRelPoi = (spuId: number, poiIdList: number[]) => submitAddRelPoi({
  spuId,
  poiIdList
})
export const fetchGetSpChangeInfo = (spuId: number) => getSpChangeInfo({ spuId })
