import Vue from 'vue'
import { getName } from '../helper'
import './index.less'

export default (WrapperComponent) => Vue.extend({
  name: getName('with-input-tip', WrapperComponent),
  props: {
    tip: String
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    handleFocus () {
      this.show = true
      this.$emit('on-focus')
    },
    handleBlur () {
      this.show = false
      this.$emit('on-blur')
    },
    renderTip (h) {
      if (!this.show || !this.tip) {
        return null
      }
      return h('span', { class: 'with-input-tip' }, [this.tip])
    }
  },
  render (h) {
    const { 'on-focus': onFocus, 'on-blur': onBlur, ...rest } = this.$listeners
    const node = h(WrapperComponent, {
      attrs: { ...this.$attrs },
      on: {
        ...rest,
        'on-blur': this.handleBlur,
        'on-focus': this.handleFocus
      },
      scopedSlots: this.$scopedSlots
    })
    const tip = this.renderTip(h)
    return h('div', { style: { 'position': 'relative' } }, [node, tip])
  }
})
