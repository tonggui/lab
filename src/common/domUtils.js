export const scrollToTop = () => {
  let $dom = document.scrollingElement
  if (!$dom) {
    if (document.documentElement.scrollTop) {
      $dom = document.documentElement
    } else {
      $dom = document.body
    }
  }
  $dom.scrollTop = 0
}
