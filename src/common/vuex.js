import { noop, isFunction } from 'lodash'

export const createCallback = (success, error) => {
  if (!success && !error) {
    return null
  }
  return {
    onSuccess: success || noop,
    onError: error || noop
  }
}

const isCallback = (callback) => {
  if (!callback) {
    return false
  }
  return isFunction(callback.onSuccess) || isFunction(callback.onError)
}

export function wrapperEmitWithCallback (fn, context = null) {
  return (...rest) => {
    let cb = rest.slice(-1)[0]
    if (!isCallback(cb)) {
      return fn.call(context, ...rest)
    }
    const args = rest.slice(0, -1)
    return new Promise((resolve, reject) => {
      const onSuccess = (response) => {
        cb.onSuccess.call(context, response)
        resolve()
      }
      const onError = (err) => {
        console.error(err)
        const msg = err.code ? err : ''
        cb.onError.call(context, msg)
        resolve()
      }
      try {
        const promise = fn.call(context, ...args)
        if (promise instanceof Promise) {
          promise.then(onSuccess).catch(onError)
        } else {
          onSuccess(promise)
        }
      } catch (err) {
        onError(err)
      }
    })
  }
}
