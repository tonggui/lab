import { isFunction } from 'lodash'

export function wrapperWithCallback (name) {
  return async (dispatch, ...rest) => {
    let cb
    let args = rest
    if (isFunction(cb)) {
      cb = rest.slice(-1)[0]
      args = rest.slice(0, -1)
    }
    const response = await dispatch.call(this, name, ...args)
    cb && cb(response)
  }
}
