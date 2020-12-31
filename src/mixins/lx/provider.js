import lx from '@/common/lx/lxReport/baseLxReport'

export const buildCustomLxProvider = (customer = v => v, extend = false) => {
  return function () {
    const vueInstance = this
    let $baseLx = lx
    if (extend) {
      if (!vueInstance.$lx) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`If use extend mode, you must inject '$lx' from parent!`)
        }
      } else {
        $baseLx = vueInstance.$lx
      }
    }

    const $lx = Object.create($baseLx)
    $lx.getValLab = (...args) => customer.call(vueInstance, $baseLx.getValLab(...args))

    return {
      $lx
    }
  }
}

export const buildLxExtendInject = (otherInjects = {}) => {
  return function () {
    if (Array.isArray(otherInjects)) {
      return ['$lx'].concat(otherInjects)
    } else {
      return Object.assign({}, otherInjects, {
        $lx: {
          default: () => lx
        }
      })
    }
  }
}
