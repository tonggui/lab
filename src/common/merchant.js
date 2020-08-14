const commonMerchantConfig = {}

const configPrefixKey = 'merchant'

const getConfigKey = key => `${configPrefixKey}.${key}`

export const ConfigKeys = {
  MERCHANT_ID: 'merchantId'
}

export const updateMerchantConfig = (key, value) => {
  commonMerchantConfig[key] = value
  console.log('updateMerchantConfig', key, value)
  sessionStorage.setItem(getConfigKey(key), JSON.stringify({ value }))
  return commonMerchantConfig
}

export const getMerchantConfig = (key) => {
  if (key in commonMerchantConfig) {
    console.log('getMerchantConfigCache', key in commonMerchantConfig, commonMerchantConfig)
    return commonMerchantConfig[key]
  } else {
    const cachedValue = sessionStorage.getItem(getConfigKey(key))
    console.log('getMerchantConfig', key, cachedValue)
    if (cachedValue) {
      commonMerchantConfig[key] = JSON.parse(cachedValue.value)
      return cachedValue.value
    }
  }
}
