const createInstance = (Component, props) => {
  const $body = document.body
  const $dom = document.createElement('div')
  $body.appendChild($dom)
  return new Component({
    el: $dom,
    propsData: props
  })
}

export default (Component) => {
  let instance = null
  return (props) => {
    if (!instance) {
      instance = createInstance(Component, props)
    } else {
      Object.entries(props).forEach(([key, value]) => {
        instance[key] = value
      })
    }
    return instance
  }
}
