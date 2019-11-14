/*
 * @description
 *   Please write the wrapper script's description
 * @author
 *   gl (guoli06@meituan.com)
 * @version
 *   1.0.0(2019/11/13)
 */
import { isFunction } from 'lodash'

function isPromise (obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

const Akita = window.Akita

export function customWrapAkitaBusiness (
  name,
  type,
  important
) {
  return (func) => {
    if (!isFunction(func)) {
      throw new Error('akitaBusinessLog only receive function param')
    }
    const level = important ? 'major' : 'default'
    return (...args) => {
      const moduleName = isFunction(name) ? name(...args) : name
      const moduleSubType = isFunction(type) ? type(...args) : type

      try {
        const res = func(...args)
        if (isPromise(res)) {
          Promise.resolve(res)
            .then(() => Akita.metrics.business(moduleName, moduleSubType, true, level))
            .catch(() => Akita.metrics.business(moduleName, moduleSubType, false, level))
          return res
        }
        Akita.metrics.business(moduleName, moduleSubType, true, level)
        return res
      } catch (e) {
        Akita.metrics.business(moduleName, moduleSubType, false, level)
        throw e
      }
    }
  }
}
