let index = 0

export const getName = (prefix, Component) => {
  let name = Component.name
  if (!name) {
    if (Component.options) {
      name = Component.options.name
    } else {
      name = index++
    }
  }
  return `${prefix}_${name}`
}
