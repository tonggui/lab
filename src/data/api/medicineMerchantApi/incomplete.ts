import httpClient from '../../client/instance/medicineMerchant'
import { MEDICINE_MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
import {
  convertMedicineMerchantProductList as convertMerchantProductListFromServer
} from '../../helper/product/merchant/convertFromServer'
import {
  convertMerchantSpChangeInfo as convertMerchantSpChangeInfoFromServer
} from '../../helper/product/standar/convertFromServer'
import {
  convertCategoryAttrList
} from '../../helper/category/convertFromServer'
import { getCategoryAttrs } from '@/data/api/medicine'

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

export const fetchProductChangeInfo = async (params) => {
  const { categoryId = 0, poiId, status, ...rest } = params
  const categoryAttrAndValueList = await getCategoryAttrs({ categoryId, poiId }, true)
  // rest.opLogId = '2629927421409001068'
  // rest.opLogTime = '1609212544661'
  const data = status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE ? await getProductChangeInfo(rest) : await getDetailOptimizedProduct(rest)
  const { basicInfoList = [], categoryInfoList = [], ...product } = data
  return {
    ...convertMerchantSpChangeInfoFromServer({ basicInfoList: basicInfoList || [], categoryInfoList: categoryInfoList || [], categoryAttrAndValueList }),
    product
  }
}

/**
 * 商家商品中心-商品优化-查询单个待优化商品详情
 * @param merchantId
 * @param spuId
 */
export const getProductChangeInfo = (params) => {
  return httpClient.post('/r/getProductChangeInfo', params)
}

/**
 * 商家商品中心-商品优化-查询已优化商品详情
 * @param merchantId
 * @param opId 操作记录id
 * @param ctime 列表页返回的操作时间，时间戳ms级别
 */
export const getDetailOptimizedProduct = (params) => {
  return httpClient.post('r/getDetailOptimizedProduct', params)
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
        const { basicInfoList, categoryInfoList, categoryAttrAndValueList, ...product } = item
        return {
          ...convertMerchantSpChangeInfoFromServer({
            basicInfoList: basicInfoList || [],
            categoryInfoList: categoryInfoList || [],
            categoryAttrAndValueList: convertCategoryAttrList(categoryAttrAndValueList || [], { isMedicine: true, future: true })
          }),
          product
        }
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
