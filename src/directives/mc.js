import { on } from '@/common/lx/dom'
import lx from '@/common/lx/lxReport'

const s = JSON.stringify
const p = JSON.parse

export default {
  bind (el, binding, vnode) {
    const {
      bid, cid, val = {}, option = {}
    } = binding.value

    // if (binding.modifiers && binding.modifiers.change) {
    //   const vm = vnode.componentInstance
    //   vm.$watch('value', (newValue) => {
    //     lx.mc({
    //       bid,
    //       cid,
    //       val: {
    //         [binding.arg || 'value']: newValue ? 1 : 0
    //       },
    //       option
    //     }, binding.arg)
    //   })
    // } else {
    if (s(val) !== '{}') {
      el.setAttribute('data-val', s(val))
    }

    const handler = e => {
      if (binding.modifiers && binding.modifiers.stop) {
        e.stopPropagation()
      }
      let valLab = p(el.getAttribute('data-val')) || {}
      lx.mc({ bid, cid, val: valLab, option }, binding.arg, { $el: el })
    }
    // on(el, 'click', handler)
    on(el, 'mousedown', handler) // 使用mousedown的原因（fix: 解决点击按钮跳转页面是按钮埋点 cid 取值不对）
    // }
  },

  update (el, binding, vnode) {
    const {
      val = {}
    } = binding.value
    const {
      oldVal = {}
    } = binding.oldValue

    if (s(val) !== '{}' || s(val) !== s(oldVal)) {
      el.setAttribute('data-val', s(val))
    }
  }
}
