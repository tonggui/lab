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

const defaultCallback = createCallback(noop, noop)

export function wrapperEmitWithCallback (fn, context = null) {
  return (...rest) => {
    let cb = rest.slice(-1)[0]
    let args = rest.slice(0, -1)
    if (!isCallback(cb)) {
      cb = { ...defaultCallback }
      args = rest
    }
    const onSuccess = (response) => {
      cb.onSuccess.call(context, response)
      // cb.onSuccess.bind(context)
    }
    const onError = (err) => {
      console.error(err)
      const error = err.code ? err : ''
      cb.onError.call(context, error)
    }
    try {
      const promise = fn.call(context, ...args)
      if (promise instanceof Promise) {
        return new Promise((resolve, reject) => {
          return promise.then((response) => {
            onSuccess(response)
            resolve()
          }).catch((err) => {
            onError(err)
            resolve()
          })
        })
      }
      onSuccess(promise)
    } catch (err) {
      onError(err)
    }
  }
}
