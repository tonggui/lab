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
  submitAddRelPoi,
  submitModProductSkuPrice,
  submitModProductSkuStock
} from '../merchantApi/product'
import {
  convertTagListSort as convertTagListSortToServer
} from '../helper/category/convertToServer'
import {
  PRODUCT_SELL_STATUS,
  SKU_EDIT_TYPE
} from '../enums/product'
import {
  Tag
} from '../interface/category'
import {
  Product,
  Sku
} from '../interface/product'

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

export const fetchSubmitDeleteProduct = (idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[]) => submitDeleteProduct({ idList, isMerchantDelete, isSelectAll, poiIdList })

export const fetchSubmitModProductSku = (type: SKU_EDIT_TYPE, spuId: number, skuList: Sku[], poiIdList: number[]) => {
  if (type === SKU_EDIT_TYPE.PRICE) {
    return fetchSubmitModProductSkuPrice(spuId, skuList, poiIdList)
  } else if (type === SKU_EDIT_TYPE.STOCK) {
    return fetchSubmitModProductSkuStock(spuId, skuList, poiIdList)
  }
}

export const fetchSubmitModProductSkuPrice = (spuId: number, skuList: Sku[], poiIdList: number[]) => submitModProductSkuPrice({ spuId, poiIdList, skuList })

export const fetchSubmitModProductSkuStock = (spuId: number, skuList: Sku[], poiIdList: number[]) => submitModProductSkuStock({ spuId, poiIdList, skuList })

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), wmPoiIds: poiIdList })

export const fetchGetProductRelPoiList = (spuId: number, pagination: Pagination, filters: { poiId?: number, exist: number }) => getProductRelPoiList({ pagination, spuId, filters })

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
