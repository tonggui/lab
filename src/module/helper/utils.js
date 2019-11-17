export const some = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.some(fn)
}
export const every = (fn, defaultValue = false) => (list) => {
  if (list.length <= 0) {
    return defaultValue
  }
  return list.every(fn)
}
