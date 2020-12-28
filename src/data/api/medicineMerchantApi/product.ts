import httpClient from '../../client/instance/medicineMerchant'
import {
  Pagination
} from '@/data/interface/common'
import {
  MERCHANT_PRODUCT_STATUS,
  PRODUCT_SELL_STATUS,
  PRODUCT_STOCK_STATUS
} from '../../enums/product'

import {
  convertMerchantProductList as convertMerchantProductListFromServer,
  convertProductDetail as convertProductDetailWithCategoryAttrFromServer
} from '../../helper/product/merchant/convertFromServer'

import {
  convertProductToServer
} from '../../helper/product/merchant/convertToServer'

import {
  convertPoiList as convertPoiListFromServer
} from '@/data/helper/poi/convertFromServer'

import { defaultTo } from 'lodash'

export const getProductList = (params) => {
  const { pagination, keyword, brandId, status, ...rest } = params
  return httpClient.post('r/listProduct', {
    ...rest,
    keyWords: keyword || '',
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

/**
 * 获取医药商家商品中心编辑页商品详情
 * @param params
 */
export const getProductDetail = (params) => httpClient.post('r/getProductDetail', params)
  .then(convertProductDetailWithCategoryAttrFromServer)

/**
 * 商家商品中心保存接口
 * @param product
 * @param context
 */
export const submitProductInfo = (product, context) => {
  const params = convertProductToServer(product, context)
  const { ignoreSuggestCategory, suggestCategoryId, isNeedCorrectionAudit, needAudit, saveType = undefined } = context
  params.ignoreSuggestCategory = ignoreSuggestCategory
  params.suggestCategoryId = suggestCategoryId
  params.saveType = saveType || (needAudit ? 2 : 1) // 保存状态：1-正常保存; 2-提交审核; 3-重新提交审核(目前仅在审核中)
  params.auditSource = isNeedCorrectionAudit ? 2 : 1 // 数据来源：1-商家提报; 2-商家纠错

  return product.id ? httpClient.post('w/updateProduct', params) : httpClient.post('w/addProduct', params)
}

/**
 * 商家商品中心-商品优化-批量替换商品
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const batchReplaceProductChangeInfo = (params) => {
  return httpClient.post('/w/batchReplaceProductChangeInfo', params)
}

export const getProductRelPoiList = ({
  pagination,
  spuId,
  filters
} : {
  pagination: Pagination,
  spuId: number,
  filters: {
    poiId?: number,
    exist: number,
    sellStatus?: PRODUCT_SELL_STATUS,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: PRODUCT_STOCK_STATUS
  }
}) => httpClient.post('r/listRelPoi', {
  pageSize: pagination.pageSize,
  pageNum: pagination.current,
  spuId,
  poiId: defaultTo(filters.poiId, ''),
  exist: filters.exist,
  sellStatus: defaultTo(filters.sellStatus, PRODUCT_SELL_STATUS.ALL),
  minPrice: defaultTo(filters.minPrice, -1),
  maxPrice: defaultTo(filters.maxPrice, -1),
  stockStatus: defaultTo(filters.stockStatus, PRODUCT_STOCK_STATUS.ALL)
}).then(data => {
  data = data || {}
  const { list, totalCount } = data
  const page = {
    ...pagination,
    total: totalCount || 0
  }
  const spu = data.spu || {}
  const product = {
    id: spu.id,
    name: spu.name,
    upcCode: spu.upc,
    skuCode: spu.skuCode,
    picture: spu.pic,
    poiIdList: spu.poiIds || []
  }
  return {
    pagination: page,
    product,
    list: (list || []).map(({ poiId, ...rest }) => ({ id: poiId, ...rest }))
  }
})

export const getProductAllRelPoiList = ({ spuId, excludeList, poiIdList } : { spuId: number, excludeList: number[], poiIdList?: number[] }) => httpClient.post('r/listAllRelPoi', {
  spuId,
  excludePoiIds: excludeList,
  poiIds: poiIdList || []
}).then(data => {
  const { list } = (data || {}) as any
  return convertPoiListFromServer(list)
})