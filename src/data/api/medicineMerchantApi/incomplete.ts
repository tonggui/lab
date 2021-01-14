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
import {
  convertProductSkuList
} from '../../helper/product/withCategoryAttr/convertFromServer'

/**
 * 商家商品中心-配置管理-查询商品优化开关
 * @param merchantId
 * @param status
 */
export const getBatchOptimizationStatus = () => httpClient.get('r/getBatchOptimizationStatus')

/**
 * 商家商品中心-配置管理-商品优化开关
 * @param merchantId
 * @param status
 */
export const updateBatchOptimizationStatus = (params: {
  status: number;
}) => httpClient.post('w/updateBatchOptimizationStatus', params)

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

interface OptimizedProductChangeParams {
  opLogId: string;
  opLogTime: string;
}

interface ProductChangeParams {
  spuId: string;
}

export const fetchProductChangeInfo = async ({ categoryId = 0, poiId, status, ...rest }: {
  categoryId: number;
  poiId: number;
  status: string;
}) => {
  const categoryAttrAndValueList = await getCategoryAttrs({ categoryId, poiId }, true)
  const data = status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE ? await getProductChangeInfo(<ProductChangeParams>rest) : await getDetailOptimizedProduct(<OptimizedProductChangeParams>rest)
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
export const getProductChangeInfo = (params: ProductChangeParams) => {
  return httpClient.post('/r/getProductChangeInfo', params)
}

/**
 * 商家商品中心-商品优化-查询已优化商品详情
 * @param merchantId
 * @param opLogId 操作记录id
 * @param opLogTime 列表页返回的操作时间，时间戳ms级别
 */
export const getDetailOptimizedProduct = (params: OptimizedProductChangeParams) => {
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
export const getlistProductChangeInfo = (params: {
  isAll: number;
  pageSize: number;
  pageNum: number;
  spuIds?: string[];
}) => {
  return httpClient.post('/r/listProductChangeInfo', params).then(data => {
    const { products = [], ...rest } = data
    return {
      products: products.map((item) => {
        const { basicInfoList, categoryInfoList, categoryAttrAndValueList, ...product } = item
        const { skuVoList, upc } = product
        const skuList = convertProductSkuList(skuVoList || [{}])
        const displayInfo: (string|string[])[] = []
        const spuExtends = product.wmProductSpuExtends || {}
        // const isOTC = +(spuExtends['1200000081'] || {}).value === 1 // 处方类型（是否OTC）
        // const isPrescription = +(spuExtends['1200000081'] || {}).value === 2 // 处方类型（是否为处方药）
        const sourceFoodCode = `${skuList[0].sourceFoodCode || ''}` // 货号
        const permissionNumber = `${(spuExtends['1200000086'] || {}).value || ''}` // 批准文号
        // 药品基本信息中展示批准文号、货号、UPC
        displayInfo.push([permissionNumber, sourceFoodCode], [upc])
        product.displayInfo = displayInfo
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
 * @param spuId
 */
export const replaceProductChangeInfo = (params: {
  spuId: string;
}) => {
  return httpClient.post('/w/replaceProductChangeInfo', params)
}

/**
 * 商家商品中心-商品优化-批量替换商品
 * @param merchantId
 * @param spuIds
 * @param isAll
 */
export const batchReplaceProductChangeInfo = (params: {
  isAll: number;
  spuIds?: string[];
}) => {
  return httpClient.post('/w/batchReplaceProductChangeInfo', params)
}
