export function wrapperWithCallback (name) {
  return async (dispatch, ...rest) => {
    const args = rest.slice(0, -1)
    const cb = rest.slice(-1)[0]
    const response = await dispatch.apply(this, [name, ...args])
    cb(response)
  }
}
