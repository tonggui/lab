export default (href) => {
  if (window.bridge && window.bridge.jumpTo) {
    window.bridge.jumpTo({ href })
  } else {
    window.open(href, '_blank')
  }
}
