import httpClient from '../client/instance/medicineMerchant'

import {
  MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS
} from '../enums/product'
import {
  convertMerchantProductList as convertMerchantProductListFromServer
} from '../helper/product/merchant/convertFromServer'

export const getProductList = (params) => {
  const { pagination, keyword, tagId, includeStatus, needTags, brandId, status } = params
  return httpClient.post('r/listProduct', {
    keyWords: keyword || '',
    tagId,
    includeStatus,
    needTags: needTags,
    brandId: brandId || 0,
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    missingRequiredInfo: status === MERCHANT_PRODUCT_STATUS.MISSING_INFORMATION ? 1 : 0
  }).then(data => {
    const { pageNum, pageSize, totalCount, products, queryCount } = (data || {}) as any
    return {
      pagination: {
        ...pagination,
        current: pageNum,
        pageSize,
        total: totalCount
      },
      statistics: queryCount,
      list: convertMerchantProductListFromServer(products)
    }
  })
}

export const submitUpdateProductSequence = ({ spuId, sequence, tagId } : { spuId: number, sequence: number, tagId: number }) => httpClient.post('w/updateTagProductSequence', {
  tagId,
  spuId,
  sequence
})

export const submitAsyncProductSequence = ({ tagId, isSelectAll, poiIdList } : { tagId: number, isSelectAll: boolean, poiIdList: number[] }) => httpClient.post('w/syncTagProductSequence', {
  tagId,
  isUpdateAllPoi: isSelectAll,
  wmPoiIds: poiIdList
})

export const submitModProductSellStatus = ({ idList, sellStatus }: { idList: number[], sellStatus: PRODUCT_SELL_STATUS }) => httpClient.post('w/batchUpdateSaleStatus', {
  spuIds: idList,
  sellStatus: sellStatus
})

export const submitDeleteProduct = ({ idList, isMerchantDelete, isSelectAll, poiIdList } : { idList: number[], isMerchantDelete: boolean, isSelectAll: boolean, poiIdList: number[] }) => httpClient.post('w/batchDelete', {
  spuIds: idList,
  isOnlyDeleteMerchant: isMerchantDelete ? 1 : 2,
  isSelectAll: isSelectAll ? 1 : 2,
  wmPoiIds: poiIdList
})

export const submitModProductSkuPrice = ({ spuId, poiIdList, skuIdPriceMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdPriceMap: ({ skuId: number, price: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('w/updatePrice', {
    spuId,
    wmPoiIds: poiIdList,
    skuPriceVoList: skuIdPriceMap,
    isUpdateAllPoi: isSelectAll
  })
}

export const submitModProductSkuStock = ({ spuId, poiIdList, skuIdStockMap, isSelectAll } : { spuId: number, poiIdList: number[], skuIdStockMap: ({ skuId: number, stock: number, isChanged: boolean })[], isSelectAll: boolean }) => {
  return httpClient.post('w/updateStock', {
    spuId,
    wmPoiIds: poiIdList,
    skuStockVoList: skuIdStockMap,
    isUpdateAllPoi: isSelectAll
  })
}