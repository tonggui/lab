import _get from 'lodash/get'
import lx from '@/common/lx/lxReport'

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
    if (Array.isArray(cid)) {
      cid = cid.find(c => c.math && c.math(to.query)) || ''
    }
    $cid.setAttribute('content', cid)
    if (cid && prevPath !== to.path) {
      prevPath = to.path
      lx.pv({ ...to.meta.pv, cid }, type)
    }
  }
  next()
}
