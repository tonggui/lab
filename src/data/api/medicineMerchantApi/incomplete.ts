import httpClient from '../../client/instance/medicineMerchant'
import {
  convertMerchantProductList as convertMerchantProductListFromServer
} from '../../helper/product/merchant/convertFromServer'

/**
 * 商家商品中心-配置管理-查询商品优化开关
 * @param merchantId
 * @param status
 */
export const getBatchOptimizationStatus = (params) => {
  return httpClient.get('r/getBatchOptimizationStatus', params)
}

/**
 * 商家商品中心-配置管理-商品优化开关
 * @param merchantId
 * @param status
 */
export const updateBatchOptimizationStatus = (params) => {
  return httpClient.post('w/updateBatchOptimizationStatus', params)
}

/**
 * 商家商品中心-商品优化-获取待优化列表
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const getListOptimizingProduct = (params) => {
  const { pagination, merchantId } = params
  return httpClient.post('r/listOptimizingProduct', {
    merchantId,
    pageSize: pagination.pageSize,
    pageNum: pagination.current
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

/**
 * 商家商品中心-商品优化-获取优化记录列表
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const getListOptimizedProduct = (params) => {
  const { pagination, merchantId } = params
  return httpClient.post('r/listOptimizedProduct', {
    merchantId,
    pageSize: pagination.pageSize,
    pageNum: pagination.current
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

/**
 * 商家商品中心-商品优化-批量替换商品
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const batchReplaceProductChangeInfo = (params) => {
  return httpClient.post('/w/batchReplaceProductChangeInfo', params)
}
