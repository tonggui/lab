import _get from 'lodash/get'
import lx from '@/common/lx/lxReport'
import { decodeParamsFromURLSearch } from '@/common/constants'
import { get } from 'lodash'

let prevPath = ''

const getCidDom = () => {
  let $cid = document.querySelector('meta[name="lx:cid"]')
  if (!$cid) {
    $cid = document.createElement('meta')
    $cid.setAttribute('name', 'lx:cid')
    document.querySelector('head').appendChild($cid)
  }
  return $cid
}

export default (to, _from, next) => {
  if (to.meta && to.meta.pv) {
    const $cid = getCidDom()
    let cid = _get(to.meta.pv, 'cid', '')
    const type = _get(to.meta.pv, 'type')
    const pageSource = _get(to.meta.pv, 'page_source') || window.page_source
    if (Array.isArray(cid)) {
      cid.some(c => {
        if (c.match && c.match(to.query)) {
          cid = c.id
          return true
        }
        return false
      })
    }
    $cid.setAttribute('content', cid)
    if (cid && prevPath !== to.path) {
      prevPath = to.path
      lx.pv({ ...{
        ...to.meta.pv,
        val: {
          ..._get(to.meta.pv, 'val', {}),
          page_source: pageSource
        }
      },
      cid }, type)
    }
  }
  if (get(decodeParamsFromURLSearch('awardCode'), 'taskId')) {
    window.page_source = 3
    window.page_source_param = {
      task_id: get(decodeParamsFromURLSearch('awardCode'), 'taskId')
    }
  } else if (to.meta && to.meta.page_source) {
    window.page_source = to.meta.page_source || ''
  } else {
    window.page_source = ''
  }
  if (window.page_source === undefined) window.page_source = ''
  next()
}
