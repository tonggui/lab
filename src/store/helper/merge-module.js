import { merge, isFunction } from 'lodash'

export default (prevModule, nextModule) => {
  const { state: prevState, ...rest } = prevModule
  const { state: nextState } = nextModule
  let newState = (...args) => {
    let prev = prevState
    let next = nextState
    if (isFunction(prevState)) {
      prev = prevState(...args)
    }
    if (isFunction(nextState)) {
      next = nextState(...args)
    }
    return merge(prev, next)
  }
  return merge(rest, nextModule, {
    state: newState
  })
}
