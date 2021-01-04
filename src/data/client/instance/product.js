import { stringify, parse } from 'qs'
import Client from '../factory'
import { BASE_URL } from '../config'
import { getMerchantConfig } from '@/common/merchant'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformRequest: [(data, headers) => {
    const searchParams = parse(window.location.search, {
      ignoreQueryPrefix: true
    })
    const currentMerchantId = getMerchantConfig('merchantId')
    // 兼容商家商品中心
    if (!searchParams.wmPoiId && currentMerchantId) {
      headers['merchantId'] = currentMerchantId
    }

    if (typeof data === 'object') {
      if (!(data instanceof FormData)) {
        return stringify(data)
      }
    }
    return data
  }],
  transformResponse: [(data) => {
    if (typeof data === 'object') {
      const { msg, ...rest } = data
      const newData = {
        ...rest,
        message: data.msg
      }
      return newData
    }
    return data
  }]
})
