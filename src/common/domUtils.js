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
