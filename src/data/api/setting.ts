import httpClient from '../client/instance/product'

export const getLimitRules = (wmPoiId: number, merchantId: number) => httpClient.get('retail/r/getLimitRules', { wmPoiId, merchantId })
  .then(data => data || {})
