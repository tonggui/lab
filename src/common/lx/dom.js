/* 给元素绑定事件 */
export const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.attachEvent(`on${event}`, handler)
      }
    }
  }
})()

/* 给元素去除事件绑定 */
export const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event) {
        element.detachEvent(`on${event}`, handler)
      }
    }
  }
})()
