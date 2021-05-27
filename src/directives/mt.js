import lx from '@/common/lx/lxReport'
import TimeCounters from '@/common/lx/lxReport/lxTime'

export const buildLxMcDirective = (resolveLxInstanceByVNode = () => lx) => ({
  bind (el, binding, vnode) {
    const {
      key, visible
    } = binding.value
    console.log('bind-------val', key, visible)
    if (visible) {
      TimeCounters.setTime(key, +new Date())
    } else {
      TimeCounters.setTime(key, +new Date())
    }
  },

  update (el, binding, vnode) {
    const {
      key, visible
    } = binding.value
    console.log('update-------val', key, visible)
    if (visible) {
      TimeCounters.setTime(key, +new Date())
    } else {
      TimeCounters.setTime(key, +new Date())
    }
  }
})

export default buildLxMcDirective()
