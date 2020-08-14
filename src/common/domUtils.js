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

export function isWindow (obj) {
  return obj !== null && obj !== undefined && obj === obj.window
}

export default function getScroll (target) {
  if (typeof window === 'undefined') {
    return 0
  }
  const method = 'scrollTop'
  let result = 0
  if (isWindow(target)) {
    result = target.pageYOffset
  } else if (target instanceof Document) {
    result = target.documentElement[method]
  } else if (target) {
    result = target[method]
  }
  if (target && !isWindow(target) && typeof result !== 'number') {
    result = (target.ownerDocument || target).documentElement[method]
  }
  return result
}

export function easeInOutCubic (t, b, c, d) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }
  // eslint-disable-next-line no-return-assign
  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}

export const scrollTo = (y, { container = window, callback, duration = 450 } = {}) => {
  const scrollTop = getScroll(container)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop)
    } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
      container.documentElement.scrollTop = nextScrollTop
    } else {
      container.scrollTop = nextScrollTop
    }
    if (time < duration) {
      window.requestAnimationFrame(frameFunc)
    } else if (typeof callback === 'function') {
      window.requestAnimationFrame(callback)
    }
  }
  window.requestAnimationFrame(frameFunc)
}
