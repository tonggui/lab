import { isFunction } from 'lodash'

/**
 * 异步接口获取后使用location.href在壳子跳转时会报错
 * @param href
 */
export const bridgeJump = (href) => {
  if (window.bridge && window.bridge.jumpTo && isFunction(window.bridge.jumpTo)) {
    window.bridge.jumpTo({ href })
  } else {
    const url = location.protocol + '//' + location.hostname + '/#' + href
    setTimeout(() => { top.location.href = url })
  }
}
