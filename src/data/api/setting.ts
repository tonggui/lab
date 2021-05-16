import httpClient from '../client/instance/product'

export const getLimitRules = (wmPoiId: number, merchantId: number) => httpClient.get('retail/r/getLimitRules', { wmPoiId, merchantId })
  .then(data => data || {})

export const delRule = (ruleId: number, wmPoiId: number, merchantId: number) => httpClient.get('retail/w/delRule', { ruleId, wmPoiId, merchantId })
  .then(data => data || {})

export const saveLimitRule = (wmPoiId: number, merchantId: number, limitRule: object, tagStats: Array<object>) => httpClient.post('retail/w/saveLimitRule', { wmPoiId, merchantId, limitRule, tagStats })
  .then(data => data || {})
