import lx from '@/common/lx/lxReport'

const s = JSON.stringify

export default {
  bind (el, binding) {
    if (binding.value) {
      const {
        cid, val = {}, env = {}
      } = binding.value
      lx.pv({ cid, val, env }, binding.arg, { $el: el })
      console.log('PageView reported.' + s(binding.value))
    } else {
      lx.pv()
      console.log('PageView reported.')
    }
  }
}
