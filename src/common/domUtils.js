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
// copy from https://github.com/view-design/ViewUI/blob/master/src/utils/assist.js#L19
let cached
export const getScrollBarSize = (refresh) => {
  if (refresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}
