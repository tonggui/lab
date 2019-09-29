export const scrollToTop = (top = 0) => {
  const $dom = getScrollElement()
  $dom.scrollTop = top
}

export const getScrollElement = () => {
  let $dom = document.scrollingElement
  if (!$dom) {
    if (document.documentElement.scrollTop) {
      $dom = document.documentElement
    } else {
      $dom = document.body
    }
  }
  return $dom
}

// TODO 兼容性问题
export const triggerMouseEvent = (dom, type) => {
  const eventDown = document.createEvent('MouseEvents')
  eventDown.initMouseEvent(type, true, true)
  dom.dispatchEvent(eventDown)
  // const event = new MouseEvent(type, {
  //   canBubble: false,
  //   cancelable: false,
  // })
  // dom.dispatchEvent(event)
}
