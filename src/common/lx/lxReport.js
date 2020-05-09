/**
 * 将 LXAnalytics() 方法封装一下
 * 对于指令的使用方式，请参考src/directives/README.md
 */
import { getCookie } from './cookie'
import { poiId, getSpuId } from '@/common/constants'

const wmPoiId = Number(poiId || 0) <= 0 ? 0 : poiId // 埋点 多店 poiId传0不是-1
function getValLab (val) {
  const { keyword, ...valLab } = val
  const v = {
    poi_id: wmPoiId,
    custom: valLab
  }
  const spuId = +getSpuId() || 0
  if (spuId) {
    v.product_id = spuId
  }
  keyword && (v.keyword = keyword)
  return v
}

const acctId = getCookie('acctId')
const cityId = getCookie('city_id')
const globalEnv = {
  uid: acctId,
  cityId: cityId
}

let pageViewCid = ''

export default {
  pv ({ cid = '', val = {}, env = {} }) {
    const valLab = getValLab(val)
    const pageCid = cid
    pageViewCid = cid
    const environment = { ...globalEnv, ...env }
    try {
      console.debug('%cv-lx%c %s, %s, %o', 'background-image: linear-gradient(45deg, #FFCF28 0%, #FFEC64 100%);border-radius:3px;padding:0 4px;color:#46280F;', '', 'pv', cid, valLab)
      /* eslint-disable */
      LXAnalytics('pageView', valLab, environment, pageCid)
    } catch (err) {
      console.log(err.msg || err)
    }
  },

  // 如果设置了meta：cid，就不需要传cid了
  mc ({ bid = '', cid = '', val = {}, option = {} }) {
    const valLab = getValLab(val)
    const pageCid = cid || pageViewCid
    const options = { cid: pageCid, ...option }
    try {
      console.debug('%cv-lx%c %s, %s, %o', 'background-image: linear-gradient(45deg, #61abec 0%, #61abec 100%);border-radius:3px;padding:0 4px;color:#ffffff;', '', 'mc', pageCid, bid, valLab, option)
      /* eslint-disable */
      LXAnalytics('moduleClick', bid, valLab, options)
    } catch (err) {
      console.log(err.msg || err)
    }
  },

  // 如果设置了meta：cid，就不需要传cid了
  mv ({ bid = '', cid = '', val = {}, option = {} }) {
    const valLab = getValLab(val)
    const pageCid = cid || pageViewCid
    const options = { cid: pageCid, ...option }
    try {
      console.debug('%cv-lx%c %s, %s, %o', 'background-image: linear-gradient(45deg, #FFCF28 0%, #FFEC64 100%);border-radius:3px;padding:0 4px;color:#46280F;', '', 'mv', pageCid, bid, valLab, option)
      /* eslint-disable */
      LXAnalytics('moduleView', bid, valLab, options)
    } catch (err) {
      console.log(err.msg || err)
    }
  }
}
