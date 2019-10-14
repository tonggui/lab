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
  return async (...rest) => {
    let cb = rest.slice(-1)[0]
    let args = rest
    if (isCallback(cb)) {
      args = rest.slice(0, -1)
    } else {
      cb = undefined
    }
    try {
      const response = await fn.call(context, ...args)
      cb && cb.onSuccess(response)
    } catch (err) {
      console.error(err)
      const msg = err.code ? err : ''
      cb && cb.onError(msg)
    }
  }
}
