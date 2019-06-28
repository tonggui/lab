import ProxyPolyfillFunc from '@/common/polyfill/proxy'
import { isEqual, isFunction } from 'lodash'
import Dep from './dep'

const ProxyPolyfill = ProxyPolyfillFunc()

export function getContext (initContext, contextChangeHandler) {
  const dep = new Dep()
  return new ProxyPolyfill(initContext, {
    get (target, key) {
      dep.depend(key)
      return target[key]
    },
    set (target, key, value) {
      // 如果值没有变化则不进行后续操作
      if (isEqual(target[key], value)) return true
      target[key] = value
      // 通知调用者context发生了变化
      if (isFunction(contextChangeHandler)) contextChangeHandler(key, value)
      dep.notify(key)
      return true
    }
  })
}
