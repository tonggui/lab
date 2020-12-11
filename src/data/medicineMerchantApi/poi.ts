import httpClient from '../client/instance/medicineMerchant'

export const getMerchantCommonInfo = () => httpClient.post('/r/common', {})
