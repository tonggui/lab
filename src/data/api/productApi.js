/*
 * @description
 *   Please write the productApi script's description
 *   关于单个商品的接口
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2018/5/20)
 */
import apiClient from '../client/instance/product'

export const fetchProductList = (params = {}) =>
  apiClient.post('retail/r/searchByCond', {
    wmPoiId: params.poiId,
    ...params
  }).then(data => {
    const { productList = [], ...rest } = data || {}
    return {
      ...rest,
      productList: productList.map(({ wmProductSkus, ...others }) => ({
        ...others,
        wmProductSkus: wmProductSkus || []
      }))
    }
  })

// 获取回收站商品列表
export const fetchRecycleProductList = params =>
  apiClient.post('retail/r/getRecycleProductList', params)

// 清理回收站
export const cleanRecycleBin = ({ poiId, endDate }) =>
  apiClient.post('retail/w/clearRecycleBin', {
    wmPoiId: poiId,
    endDate
  })

// 单个、批量恢复回收站商品
export const recoverRecycleSpus = ({ poiId, tagId, spuIds }) =>
  apiClient.post('retail/w/recycleProductSpus', {
    wmPoiId: poiId,
    tagId,
    spuIds
  })
