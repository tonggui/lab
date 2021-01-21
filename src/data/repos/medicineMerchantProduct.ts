import {
  Pagination
} from '../interface/common'

import {
  getProductList,
  getProductDetail,
  submitProductInfo,
  submitUpdateProductSequence,
  submitAsyncProductSequence,
  submitModProductSellStatus,
  submitDeleteProduct,
  submitModProductSkuPrice,
  submitModProductSkuStock,
  getProductRelPoiList,
  getProductAllRelPoiList,
  submitClearRelPoi,
  submitPoiProductSellStatus,
  submitAddRelPoi,
  getSearchSuggestion,
  submitBatchSaveMedicineMerchantProductBySp
} from '../api/medicineMerchantApi/product'
import {
  getListOptimizingProduct,
  getListOptimizedProduct
} from '../api/medicineMerchantApi/incomplete'

import {
  MEDICINE_MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  SKU_EDIT_TYPE,
  PRODUCT_STOCK_STATUS,
  PRODUCT_AUDIT_STATUS
} from '../enums/product'

import {
  Product,
  MerchantProduct,
  Sku
} from '../interface/product'

import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'
export {
  getSearchSugByType as fetchGetSearchSugByType
} from '../api/medicineMerchantApi/product'

/* Akita wrapper start */
const akitaWrappedSubmitModProductSellStatus = wrapAkitaBusiness(
  (params) => {
    const type = params.sellStatus ? TYPE.OFF_SHELF : TYPE.ON_SHELF
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(submitModProductSellStatus)
/* Akita wrapper end */

export const fetchGetProductList = ({ tagId, status, searchData } : { tagId: number, status: MEDICINE_MERCHANT_PRODUCT_STATUS, searchData: any }, pagination: Pagination) => {
  if (status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE) {
    return getListOptimizingProduct({ tagId, pagination, includeStatus: 1, needTags: 2, status })
  } else if (status === MEDICINE_MERCHANT_PRODUCT_STATUS.COMPLETED) {
    return getListOptimizedProduct({ tagId, pagination, searchData })
  }
  return getProductList({ tagId, pagination, includeStatus: 1, needTags: 2, status })
}

export const fetchSubmitUpdateProductSequence = (spuId: number, sequence: number, { tagId }: { tagId: number }) => submitUpdateProductSequence({
  spuId,
  sequence,
  tagId
})

export const fetchSubmitAsyncProductSequence = (tagId: number, { isSelectAll, poiIdList }) => submitAsyncProductSequence({
  tagId,
  isSelectAll,
  poiIdList
})

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => akitaWrappedSubmitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitModProduct = (product: MerchantProduct, params) => {
  const spuId = product.id
  if ('sellStatus' in params) {
    // 单条修改
    return fetchSubmitModProductSellStatus([spuId], params.sellStatus)
  }
  // TODO 其他修改逻辑
}

export const fetchSubmitDeleteProduct = wrapAkitaBusiness(MODULE.MERCHANT_PRODUCT, TYPE.DELETE, true)(
  (idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[]) => submitDeleteProduct({ idList, isMerchantDelete, isSelectAll, poiIdList })
)

export const fetchSubmitModProductSku = (type: SKU_EDIT_TYPE, product: MerchantProduct, skuList: Sku[], { poiIdList, isSelectAll } : { poiIdList: number[], isSelectAll: boolean }) => {
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

/**
 * 获取医药商家商品中心编辑页商品详情
 * @param spuId
 */
export const fetchGetProductDetail = (spuId: number) => getProductDetail({ spuId })

/**
 * 医药商家商品中心保存接口
 */
export const fetchSaveOrUpdateProduct = wrapAkitaBusiness(
  (product) => {
    const type = product.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(
  (product: Product, context: object) => submitProductInfo(product, context)
)

export const fetchGetProductListBySearch = ({ tagId, keyword, brandId, ...rest } : { tagId: number, keyword: string, brandId: number }, pagination: Pagination) => {
  return getProductList({ ...rest, tagId, pagination, includeStatus: 1, keyword, brandId: brandId || 0 })
}

export const fetchGetProductRelPoiListWithProduct = (
  spuId: number,
  pagination: Pagination,
  filters: {
    poiId?: number,
    exist: number,
    sellStatus?: PRODUCT_SELL_STATUS,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: PRODUCT_STOCK_STATUS
  }) => getProductRelPoiList({ pagination, spuId, filters })

export const fetchGetProductRelPoiList = (
  spuId: number,
  pagination: Pagination,
  poiId?: number
) => fetchGetProductRelPoiListWithProduct(spuId, pagination, { poiId, exist: 0 })

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

export const fetchGetSearchSuggestion = (params) => {
  const { keyword = '', includeStatus = undefined } = params
  return getSearchSuggestion({
    keyword,
    includeStatus,
    auditStatus: [
      PRODUCT_AUDIT_STATUS.UNAUDIT,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
      PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
      PRODUCT_AUDIT_STATUS.START_SELL_AUDITING
    ]
  })
}

export const fetchSubmitBatchSaveMedicineMerchantProductBySp = (spList: object[], poiId: string|number) => submitBatchSaveMedicineMerchantProductBySp({ spList, poiId })
