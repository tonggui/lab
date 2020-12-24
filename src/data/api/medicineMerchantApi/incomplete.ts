import httpClient from '../../client/instance/medicineMerchant'

/**
 * 商家商品中心-配置管理-商品优化开关
 * @param merchantId
 * @param status
 */
export const updateBatchOptimizationStatus = (params) => {
  return httpClient.post('w/updateBatchOptimizationStatus', params)
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
