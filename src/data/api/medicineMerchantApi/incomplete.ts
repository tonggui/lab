import httpClient from '../../client/instance/medicineMerchant'
import {
  convertMerchantProductList as convertMerchantProductListFromServer
} from '../../helper/product/merchant/convertFromServer'
import {
  convertSpChangeInfo as convertSpChangeInfoFromServer
} from '../../helper/product/standar/convertFromServer'

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
  const { pagination, merchantId, searchData } = params
  return httpClient.post('r/listOptimizedProduct', {
    merchantId,
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    ...searchData
  }).then(data => {
    const { pageNum, pageSize, totalCount, products, queryCount } = (data || {}) as any
    return {
      pagination: {
        ...pagination,
        current: pageNum,
        pageSize,
        total: totalCount
      },
      statistics: queryCount || {},
      list: convertMerchantProductListFromServer(products)
    }
  })
}

/**
 * 商家商品中心-商品优化-查询单个待优化商品详情
 * @param merchantId
 * @param spuId
 */
export const getProductChangeInfo = (params) => {
  return httpClient.post('/r/getProductChangeInfo', params).then(data => {
    return {
      ...data,
      ...convertSpChangeInfoFromServer(data)
    }
  })
}

/**
 * 商家商品中心-商品优化-查询已优化商品详情
 * @param merchantId
 * @param opId 操作记录id
 * @param ctime 列表页返回的操作时间，时间戳ms级别
 */
export const getDetailOptimizedProduct = (params) => {
  return httpClient.post('r/getDetailOptimizedProduct', params).then(data => {
    return {
      ...data,
      ...convertSpChangeInfoFromServer(data)
    }
  })
}

/**
 * 商家商品中心-商品优化-查询多个待优化商品信息
 * @param merchantId
 * @param spuIds
 * @param isAll
 * @param pageSize
 * @param pageNum
 */
export const getlistProductChangeInfo = (params) => {
  return httpClient.post('/r/listProductChangeInfo', params).then(data => {
    const { products = [], ...rest } = data
    return {
      products: products.map((item) => {
        return { ...item, ...convertSpChangeInfoFromServer(item) }
      }),
      ...rest
    }
  })
}

/**
 * 商家商品中心-商品优化-替换单个商品
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const replaceProductChangeInfo = (params) => {
  return httpClient.post('/w/replaceProductChangeInfo', params)
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
