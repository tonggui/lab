/*
 * @description
 *   Please write the onlyone script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-18)
 */
export default {
  bind (el, binding, vnode) {
    if (!('create_$' in vnode.componentInstance)) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`v-onlyone directive must be with onlyone hoc`)
      }
    }

    if (binding.value) {
      vnode.componentInstance.create_$ = true
    }
  },
  update (el, binding, vnode) {
    if (binding.value) {
      vnode.componentInstance.create_$ = true
    }
  }
}
