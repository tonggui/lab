import { get } from 'lodash'
import lx from '@/common/lx/lxReport/baseLxReport'
import { buildLxPvDirective } from '@/directives/pv'
import { buildLxMcDirective } from '@/directives/mc'
import { buildLxMvDirective } from '@/directives/mv'

const INSTANCE_CACHE_KEY = '$lx'

const resolveLxInstanceByVNode = (vnode) => {
  let lxInstance = get(vnode, ['context', INSTANCE_CACHE_KEY])
  if (lxInstance) {
    return lxInstance
  }

  let component = vnode.context.$parent
  while (component && !lxInstance) {
    if (component.$lx) {
      lxInstance = component.$lx
      vnode.context[INSTANCE_CACHE_KEY] = lxInstance
      break
    } else {
      component = component.$parent
    }
  }

  if (!lxInstance) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Something must be wrong! ResolveLxInstanceByVNode can't find $lx instance`)
    }
  }

  return lxInstance || lx
}

export default {
  inject: {
    $lx: {
      default: () => lx
    }
  },
  directives: {
    pv: buildLxPvDirective(resolveLxInstanceByVNode),
    mc: buildLxMcDirective(resolveLxInstanceByVNode),
    mv: buildLxMvDirective(resolveLxInstanceByVNode)
  }
}
