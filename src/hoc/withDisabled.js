import Vue from 'vue'
import { getName } from './helper'

export default (WrapperComponent, options) => Vue.extend({
  name: getName('with-disabled', WrapperComponent),
  props: WrapperComponent.props,
  render (h) {
    const { default: defaultSlot, ...rest } = this.$scopedSlots
    return h(WrapperComponent, {
      props: this.$props,
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: rest
    }, [
      h('Tooltip', {
        attrs: {
          ...options,
          disabled: !this.disabled
        }
      }, [
        defaultSlot
      ])
    ])
  }
})
