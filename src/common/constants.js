import { getUrlParam } from '@utiljs/param'
import {
  isB as isBussinessClient,
  isMedicine as isMedicinePoi,
  ENV,
  PREFIX
} from '@sgfe/eproduct/env'

export const getParam = key => decodeURIComponent(getUrlParam(key, window.location.href))

export const getQueryObj = (url = window.location.href) => {
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export const getPoiId = () => window.wmPoiId || getParam('wmPoiId') || undefined
export const getSpuId = () => getParam('spuId') || undefined
export const getMerchantId = () => getParam('merchantId') || undefined
export const getRuleId = () => getParam('ruleId') || undefined
export const getRouterTagId = () => getParam('routerTagId') || undefined
export const getIsSingle = () => getParam('from') === 'single' && !!getPoiId()
export const getIsMedicine = () => isMedicinePoi || getRouterTagId() === '22'

export const poiId = getPoiId()

export const routerTagId = getRouterTagId()

export const isSingle = getIsSingle()

export const isB = !!isBussinessClient

export const BASENAME = ENV === 'local' ? '' : (`${PREFIX}/pages`).replace(/\/\//g, '/')

// export const isB = true;

// 包中判断药店是通过poiTag，多店没有poiTag，只能根据routerTagId判断
export const isMedicine = isMedicinePoi || routerTagId === '22'

export const decodeParamsFromURLSearch = (key) => {
  if (!getParam(key) || !key) return
  return JSON.parse(decodeURIComponent(getParam(key)))
}
