import Vue from 'vue'
import Tooltip from '@components/tooltip'
import storage, { KEYS } from '@/common/local-storage'
import { forwardComponent } from '@/common/vnode'
import { getName } from './helper'

export default (Component) => Vue.extend({
  name: getName('withTooltip', Component),
  props: {
    tooltip: Object
  },
  computed: {
    showTooltip () {
      const { type, keyName } = this.tooltip || {}
      if (['guide', 'help'].includes(type)) {
        console.log(!storage[KEYS[keyName]], keyName)
        return !storage[KEYS[keyName]]
      }
      return true
    }
  },
  render (h) {
    const $node = forwardComponent(this, Component)
    if (this.tooltip && this.showTooltip) {
      const { events = {}, ...others } = this.tooltip
      return h(Tooltip, {
        attrs: others,
        on: events
      }, [$node])
    }
    return $node
  }
})
