import {
  Pagination
} from '../interface/common'
import {
  getProductList as getShopProductList,
  getProductDetail,
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
  getCategoryAppealInfo,
  getProductAllRelPoiList,
  deleteApproveProduct,
  submitUpdateProductSequence,
  submitAsyncProductSequence,
  getAuditProductList,
  // submitCancelProductAudit,
  getProductRevocation,
  getNeedAudit,
  getAuditProductDetail,
  getMerchantOpenStatus,
  getResetMerchant,
  getCloseMerchant,
  getRunningTaskStatus,
  getTaskFinish,
  apiBatchModifyTag
} from '../merchantApi/product'
import { getProductList as getMedicineProductList } from '../api/medicineMerchantApi/product'
import {
  convertTagListSort as convertTagListSortToServer
} from '../helper/category/convertToServer'
import {
  MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  PRODUCT_STOCK_STATUS,
  SKU_EDIT_TYPE,
  PRODUCT_AUDIT_STATUS
} from '../enums/product'
import {
  Tag
} from '../interface/category'
import {
  Product,
  Sku,
  MerchantProduct
} from '../interface/product'

import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'
import { isAssociateMedicineMerchant } from '../../module/helper/utils'

/* Akita wrapper start */
const akitaWrappedSubmitModProductSellStatus = wrapAkitaBusiness(
  (params) => {
    const type = params.sellStatus ? TYPE.OFF_SHELF : TYPE.ON_SHELF
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(submitModProductSellStatus)
/* Akita wrapper end */

export {
  submitDownloadProduct as fetchSubmitDownloadProduct,
  getDownloadTaskList as fetchGetDownloadTaskList
} from '../merchantApi/product'

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

export const fetchGetAuditProductSearchSuggestion = (keyword: string) => {
  return getSearchSuggestion({
    keyword,
    includeStatus: undefined,
    auditStatus: [
      PRODUCT_AUDIT_STATUS.AUDITING,
      PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION,
      PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
      PRODUCT_AUDIT_STATUS.START_SELL_AUDITING
    ]
  })
}

export const fetchGetMerchantOpenStatus = () => getMerchantOpenStatus()

export const fetchGetResetMerchant = () => getResetMerchant()

export const fetchGetRunningTaskStatus = (taskType) => getRunningTaskStatus({ taskType })

export const fetchTaskFinish = (taskId) => getTaskFinish({ taskId })

export const fetchGetCloseMerchant = () => getCloseMerchant()

export const fetchGetCategoryAppealInfo = (id: number) => getCategoryAppealInfo({ id })

// export const fetchGetUnRelatedProductCount = () => getUnRelatedProductCount()

export const getProductList = async (params) => await isAssociateMedicineMerchant() ? getMedicineProductList(params) : getShopProductList(params)

export const fetchGetProductList = ({ tagId, status } : { tagId: number, status: MERCHANT_PRODUCT_STATUS }, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, needTags: 2, status })
}

export const fetchGetIncludeProductList = ({ tagId, keyword } : { keyword: string, tagId: number }, pagination: Pagination) => {
  return getProductList({ keyword, tagId, pagination, includeStatus: 2, needTags: 1 })
}

export const fetchGetProductListBySearch = ({ tagId, keyword, brandId } : { tagId: number, keyword: string, brandId: number }, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, keyword, needTags: 1, brandId: brandId || 0 })
}

/**
 * 新批量关联分类商品获取接口
 * @param tagId
 * @param keyword
 * @param brandId
 * @param pagination
 */
export const fetchGetProductListForNewBatchRel = ({ tagId, keyword, startCTime } : { tagId: number, keyword: string, startCTime: number }, pagination: Pagination) => {
  return getProductList({ tagId, pagination, includeStatus: 1, keyword, needTags: 1, startCTime })
}

/**
 * 商家商品中心详情获取接口
 * @param spuId
 */
export const fetchGetProductDetail = (spuId: number) => getProductDetail({ spuId })

/**
 * 商家商品中心审核列表商品审核详情
 * @param spuId
 */
export const fetchGetAuditProductDetail = (spuId: number) => getAuditProductDetail({ spuId })

/**
 * 商家商品中心撤回接口
 * @param spuId
 */
export const fetchGetProductRevocation = (spuId: number) => getProductRevocation({ spuId })

/**
 * 商家商品中心送审条件获取
 * @param categoryId
 * @param merchantId
 */
export const fetchGetNeedAudit = (categoryId) => getNeedAudit({ categoryId })

/**
 * 商家商品中心保存接口
 */
export const fetchSaveOrUpdateProduct = wrapAkitaBusiness(
  (product) => {
    const type = product.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.MERCHANT_PRODUCT, type, true]
  }
)(
  (product: Product, context: object, extra: any) => submitProductInfo(product, context, extra)
)

export const fetchSubmitIncludeProduct = (spuIdList: number[]) => submitIncludeProduct({ spuIdList })

export const fetchSubmitModProductSellStatus = (idList: number[], sellStatus: PRODUCT_SELL_STATUS) => akitaWrappedSubmitModProductSellStatus({ idList, sellStatus })

export const fetchSubmitModProduct = (product: MerchantProduct, params) => {
  const spuId = product.id
  if ('sellStatus' in params) {
    return fetchSubmitModProductSellStatus([spuId], params.sellStatus)
  }
  // TODO 未完
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

export const fetchSubmitSaveOrder = (tagList: Tag[], map) => submitSaveOrder({ tagList: convertTagListSortToServer(tagList, map) })
// TODO
export const fetchSubmitSaveOrderWithSync = (tagList: Tag[], map, poiIdList) => submitSaveOrderWithSync({ tagList: convertTagListSortToServer(tagList, map), wmPoiIds: poiIdList })

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
export const fetchSubmitAddRelPoi = (spuId: number, poiIdList: number[], traceId: string) => submitAddRelPoi({
  spuId,
  poiIdList,
  traceId
})

// TODO
export const fetchDeleteApproveProduct = (spuIdList: number[], isMerchant: boolean) => deleteApproveProduct({ spuIdList, isMerchant })

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

export const fetchSubmitCancelProductAudit = (spuId: number) => getProductRevocation({ spuId })

export const fetchGetAuditProductList = (filter: {
  auditStatus: PRODUCT_AUDIT_STATUS[],
  searchWord: string
}, pagination: Pagination) => getAuditProductList({
  pagination,
  ...filter
})

export const fetchBatchModifyTag = (type, { tagIds, selectAll, poiIds }, productList) => apiBatchModifyTag({
  spuIds: (productList || []).map(item => item.id),
  type,
  tagIds,
  isSelectAll: selectAll,
  wmPoiIds: poiIds
})
