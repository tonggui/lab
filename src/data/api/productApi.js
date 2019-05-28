/*
 * @description
 *   Please write the productApi script's description
 *   关于单个商品的接口
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2018/5/20)
 */
import apiClient from './client'

export const fetchProductList = params =>
  apiClient.post('retail/r/searchByCond', params).then(data => {
    const { productList = [], ...rest } = data || {}
    return {
      ...rest,
      productList: productList.map(({ wmProductSkus, ...others }) => ({
        ...others,
        wmProductSkus: wmProductSkus || []
      }))
    }
  })
