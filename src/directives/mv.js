import lx from '@/common/lx/lxReport'

const s = JSON.stringify
let t
const queue = []
function checkView (el, binding) {
  let c = 0
  queue.forEach((item, i) => {
    if (item && item.el) {
      const {
        bid, cid, val = {}, option = {}
      } = item.binding.value

      const bcr = item.el.getBoundingClientRect()
      const { top, left } = bcr

      if (top < window.innerHeight && left < window.innerWidth) {
        lx.mv({ bid, cid, val, option })
        console.log('ModuleView.scroll reported.  ' + s(item.binding.value))
        delete queue[i]
      } else {
        c += 1
      }
    }
  })

  if (c === 0) {
    window.clearInterval(t)
    t = null
  }
}

function addToCheckQueue (el, binding) {
  queue.push({ el, binding })
  if (!t) {
    t = window.setInterval(() => {
      checkView(el, binding)
    }, 300)
  }
}

export default {
  bind (el, binding, vnode) {
    const {
      bid, cid, val = {}, option = {}, show
    } = binding.value

    if (binding.modifiers && binding.modifiers.scroll) { // 列表滚动曝光，只有第一次展示出来算作曝光，后续再出现不算做曝光，不上报
      addToCheckQueue(el, binding)
    } else { // 默认情况的曝光，即展示出来就算作曝光一次
      if (show !== undefined) {
        el.setAttribute('data-mv', s(show))
        if (show) {
          lx.mv({ bid, cid, val, option })
          console.log('ModuleView reported.  ' + s(binding.value))
        }
      } else {
        console.log('Error: Param show needed.')
      }
    }
  },

  update (el, binding, vnode) {
    const {
      bid, cid, val = {}, option = {}, show
    } = binding.value
    const {
      oldShow
    } = binding.oldValue

    if (show !== undefined || show !== oldShow) {
      el.setAttribute('data-mv', s(show))
      if (show) {
        lx.mv({ bid, cid, val, option })
        console.log('ModuleView reported.  ' + s(binding.value))
      }
    }
  }
}
