import httpClient from '../client/instance/product'

export const getLimitRules = (wmPoiId: number, merchantId: number) => httpClient.get('retail/r/getLimitRules', wmPoiId ? { wmPoiId } : { merchantId })
  .then(data => data || {})

export const delRule = (ruleId: number, wmPoiId: number, merchantId: number) => httpClient.get('retail/w/delRule', wmPoiId ? { wmPoiId, ruleId } : { ruleId, merchantId })
  .then(data => data || {})

export const saveLimitRule = (wmPoiId: number, merchantId: number, limitRule: object, tagStats: Array<object>) => httpClient.post('retail/w/saveLimitRule', wmPoiId ? { wmPoiId, limitRule, tagStats } : { merchantId, limitRule, tagStats })
  .then(data => data || {})

export const getRuleRelProduct = (ruleId: number, wmPoiId: number, merchantId: number) => httpClient.get('retail/r/getRuleRelProduct', wmPoiId ? { wmPoiId, ruleId } : { ruleId, merchantId })
  .then(data => data || {})
