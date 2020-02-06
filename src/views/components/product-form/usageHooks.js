import { isFunction } from 'lodash'
import lx from '@/common/lx/lxReport'

let usage = {}

window.usage = usage

const manipulate = (target, keyPath = [], setter) => {
  let len = keyPath.length
  if (!target || !len) return // 没目标
  let cur = target
  for (let i = 0; i < len; i++) {
    const key = keyPath[i]
    // 最终目标
    if (i === len - 1) {
      cur[key] = isFunction(setter) ? setter(cur[key]) : (setter !== undefined ? setter : cur[key])
      return cur[key]
    }
    if (!cur[key]) {
      cur[key] = {}
    }
    cur = cur[key]
  }
}

const increase = a => (a || 0) + 1

const hooks = {
  mounted () {
    console.log('mounted')
    lx.mc({
      bid: 'b_shangou_online_e_formusagereport_mc_mc'
    })
  },
  destroyed () {
    console.log('destroyed')
    console.log(JSON.stringify(usage))
    usage = {}
  },
  onDepend (type, key, resultKey) {
    // console.log('onDepend', type, key, resultKey)
    manipulate(usage, [type, 'depend', key], increase)
  },
  onDataChange (key, newValue, oldValue) {
    // console.log('onDataChange', key, newValue, oldValue)
    manipulate(usage, ['data', key, 'change'], increase)
  },
  onContextChange (key, newValue, oldValue) {
    // console.log('onContextChange', key, newValue, oldValue)
    manipulate(usage, ['context', key, 'change'], increase)
  },
  onConfigChange (key, resultKey, newValue, oldValue) {
    if (resultKey !== 'value') {
      // console.log('onConfigChange', key, resultKey, newValue, oldValue)
      manipulate(usage, ['field', key, 'configChange'], increase)
    }
  },
  onFieldStart (key) {
    console.log('onFieldStart', key)
    manipulate(usage, ['field', key, 'startAt'], Date.now())
  },
  onFieldEnd (key) {
    console.log('onFieldEnd', key)
    const startAt = manipulate(usage, ['field', key, 'startAt'])
    manipulate(usage, ['field', key, 'startAt'], 0)
    manipulate(usage, ['field', key, 'duration'], v => v + Date.now() - startAt)
  },
  onValidateError (key, message) {
    console.log('onValidateError', key, message)
    manipulate(usage, ['field', key, 'error'], increase)
  }
}

export default hooks
