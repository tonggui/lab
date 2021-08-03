import { isFunction } from 'lodash'
import lx from '@/common/lx/lxReport'

let usage = { url: location.href }
let startAt = 0

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
    startAt = Date.now()
  },
  destroyed () {
    usage.duration = Date.now() - startAt
    lx.mc({
      bid: 'b_shangou_online_e_formusagereport_mc_mc',
      val: {
        usage: JSON.stringify(usage)
      }
    })
    usage = { url: location.href }
    startAt = 0
  },
  onDataChange (key, newValue, oldValue) {
    manipulate(usage, ['data', key, 'change'], increase)
  },
  onContextChange (key, newValue, oldValue) {
    manipulate(usage, ['context', key, 'change'], increase)
  },
  onFieldStart (key) {
    manipulate(usage, ['field', key, 'startAt'], Date.now())
  },
  onFieldEnd (key) {
    const startAt = manipulate(usage, ['field', key, 'startAt'])
    if (startAt > 0) {
      manipulate(usage, ['field', key, 'startAt'], 0)
      manipulate(usage, ['field', key, 'duration'], v => (v || 0) + Date.now() - startAt)
    }
  },
  onValidateError (key, message) {
    manipulate(usage, ['field', key, 'error'], increase)
  }
}

export default hooks
