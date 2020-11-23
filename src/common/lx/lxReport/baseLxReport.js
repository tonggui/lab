import { getCookie } from '../cookie'
import { poiId, getSpuId } from '@/common/constants'

const acctId = getCookie('acctId')
const cityId = getCookie('city_id')
const globalEnv = {
  uid: acctId,
  cityId: cityId
}

export class BaseLxReport {
  static pageViewCid = ''

  // TODO 可重载
  getValLab (val) {
    const wmPoiId = Number(poiId || 0) <= 0 ? 0 : poiId // 埋点 多店 poiId传0不是-1
    const { keyword, poiAuditInfo, ...valLab } = val
    const v = {
      poi_id: wmPoiId,
      custom: valLab,
      x_env: process.env.AWP_DEPLOY_ENV || 'dev' // 取talos 注入的环境值
    }
    const spuId = +getSpuId() || 0
    if (spuId) {
      v.spu_id = spuId
    }
    keyword && (v.keyword = keyword)
    return v
  }

  pv ({ cid = '', val = {}, env = {} }) {
    const valLab = this.getValLab(val)
    const pageCid = cid
    BaseLxReport.pageViewCid = cid
    const environment = { ...globalEnv, ...env }
    try {
      console.debug('%cv-lx%c %s, %s, %o', 'background-image: linear-gradient(45deg, #FFCF28 0%, #FFEC64 100%);border-radius:3px;padding:0 4px;color:#46280F;', '', 'pv', cid, valLab)
      /* eslint-disable */
      LXAnalytics('pageView', valLab, environment, pageCid)
    } catch (err) {
      console.log(err.msg || err)
    }
  }

  // 如果设置了meta：cid，就不需要传cid了
  mc ({ bid = '', cid = '', val = {}, option = {} }) {
    const valLab = this.getValLab(val)
    const pageCid = cid || BaseLxReport.pageViewCid
    const options = { cid: pageCid, ...option }
    try {
      console.debug('%cv-lx%c %s, %s, %o', 'background-image: linear-gradient(45deg, #61abec 0%, #61abec 100%);border-radius:3px;padding:0 4px;color:#ffffff;', '', 'mc', pageCid, bid, valLab, option)
      /* eslint-disable */
      LXAnalytics('moduleClick', bid, valLab, options)
    } catch (err) {
      console.log(err.msg || err)
    }
  }

  // 如果设置了meta：cid，就不需要传cid了
  mv ({ bid = '', cid = '', val = {}, option = {} }) {
    const valLab = this.getValLab(val)
    const pageCid = cid || BaseLxReport.pageViewCid
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

export default new BaseLxReport()
