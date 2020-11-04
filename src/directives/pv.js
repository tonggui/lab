import lx from '@/common/lx/lxReport'

const s = JSON.stringify

export const buildLxPvDirective = (resolveLxInstanceByVNode = () => lx) => ({
  bind (el, binding, vnode) {
    const $lx = resolveLxInstanceByVNode(vnode)
    if (binding.value) {
      const {
        cid, val = {}, env = {}
      } = binding.value
      $lx.pv({ cid, val, env }, binding.arg)
      console.log('PageView reported.' + s(binding.value))
    } else {
      $lx.pv()
      console.log('PageView reported.')
    }
  }
})

export default () => buildLxPvDirective()
