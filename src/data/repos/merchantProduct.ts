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
  submitModProductSkuStock,
  getProductAllRelPoiList
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
  Sku,
  MerchantProduct
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

export const fetchSubmitModProductSku = (type: SKU_EDIT_TYPE, product: MerchantProduct, skuList: Sku[], poiIdList: number[], isSelectAll: boolean) => {
  if (type === SKU_EDIT_TYPE.PRICE) {
    return fetchSubmitModProductSkuPrice(product, skuList, poiIdList, isSelectAll)
  } else if (type === SKU_EDIT_TYPE.STOCK) {
    return fetchSubmitModProductSkuStock(product, skuList, poiIdList, isSelectAll)
  }
}

export const fetchSubmitModProductSkuPrice = (product: MerchantProduct, skuList: Sku[], poiIdList: number[], isSelectAll: boolean) => {
  const skuMap = product.skuList.reduce((prev, sku) => {
    prev[sku.id] = sku.price.value
    return prev
  }, {})
  const formatSkuList = skuList.map(sku => {
    return {
      skuId: sku.id as number,
      price: sku.price.value!,
      isChanged: sku.price.value !== skuMap[sku.id]
    }
  })
  return submitModProductSkuPrice({
    spuId: product.id,
    poiIdList,
    skuIdPriceMap: formatSkuList,
    isSelectAll
  })
}

export const fetchSubmitModProductSkuStock = (product: MerchantProduct, skuList: Sku[], poiIdList: number[], isSelectAll: boolean) => {
  const skuMap = product.skuList.reduce((prev, sku) => {
    prev[sku.id] = sku.stock
    return prev
  }, {})
  const formatSkuList = skuList.map(sku => {
    return {
      skuId: sku.id as number,
      stock: sku.stock,
      isChanged: sku.stock !== skuMap[sku.id]
    }
  })
  return submitModProductSkuStock({ spuId: product.id, poiIdList, skuIdStockMap: formatSkuList, isSelectAll })
}

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), wmPoiIds: poiIdList })

export const fetchGetProductRelPoiListWithProduct = (spuId: number, pagination: Pagination, filters: { poiId?: number, exist: number }) => getProductRelPoiList({ pagination, spuId, filters })

export const fetchGetProductRelPoiList = (spuId: number, pagination: Pagination, poiId?: number) => fetchGetProductRelPoiListWithProduct(spuId, pagination, { poiId, exist: 0 })

export const fetchGetProductAllRelPoiList = (spuId: number, excludeList: number[], poiId?: number) => getProductAllRelPoiList({ spuId, excludeList, poiIdList: poiId ? [poiId] : [] })

export const fetchGetProductRelPoiListByIdList = (spuId: number, poiIdList: number[]) => getProductAllRelPoiList({ spuId, excludeList: [], poiIdList })

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
