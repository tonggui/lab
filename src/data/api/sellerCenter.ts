import httpClient from '../client/instance/sellerCenter'

export const getProductCount = (wmPoiId: number) => httpClient.post('productManager/r/getProductCount', { wmPoiId })
  .then(data => data || {})

export const getGrey = (wmPoiId: number) => httpClient.get('productManager/r/getGrey', { wmPoiId })
  .then(data => data || {})
