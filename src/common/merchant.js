const commonMerchantConfig = {}

const configPrefixKey = 'merchant'

const getConfigKey = key => `${configPrefixKey}.${key}`

export const ConfigKeys = {
  MERCHANT_ID: 'merchantId'
}

export const updateMerchantConfig = (key, value) => {
  commonMerchantConfig[key] = value
  sessionStorage.setItem(getConfigKey(key), JSON.stringify({ value }))
  return commonMerchantConfig
}

export const getMerchantConfig = (key) => {
  if (key in commonMerchantConfig) {
    return commonMerchantConfig[key]
  } else {
    const cachedValue = sessionStorage.getItem(getConfigKey(key))
    if (cachedValue) {
      commonMerchantConfig[key] = cachedValue.value
      return cachedValue.value
    }
  }
}
