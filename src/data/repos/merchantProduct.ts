import {
  Pagination
} from '../interface/common'
import {
  getProductList,
  submitIncludeProduct,
  getSearchSuggestion,
  submitModProductSellStatus,
  submitDeleteProduct,
  submitSaveOrder,
  submitSaveOrderWithSync
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

export const fetchGetSearchSuggestion = (keyword: string) => getSearchSuggestion({ keyword })

export const fetchGetProductList = (tagId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, needTags: 1 })
}

export const fetchGetIncludeProductList = (tagId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 2, needTags: 2 })
}

export const fetchGetProductListBySearch = (tagId: number, keyword: string, brandId: number, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, keyword, needTags: 1, brandId: brandId || 0 })
}

export const fetchSubmitIncludeProduct = (spuIdList: number[]) => submitIncludeProduct({ spuIdList })

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => submitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitDeleteProduct = (idList: number[]) => submitDeleteProduct({ idList })

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), poiIdList })
