import Vue from 'vue'
import { getName } from '../helper'
import './index.less'

export default (WrapperComponent) => {
  console.log('WrapperComponent:', WrapperComponent.props)
  return Vue.extend({
    name: getName('with-default-value', WrapperComponent),
    // props: {
    //   defaultValue: WrapperComponent.props.value.type,
    //   value: WrapperComponent.props.value,
    //   defaultValueTip: String
    // },
    props: ['defaultValue', 'value', 'defaultValueTip'],
    data () {
      const isDefaultValue = this.defaultValue !== undefined && this.value === undefined
      return {
        isDefaultValue,
        focus: false
      }
    },
    methods: {
      handleChange (value) {
        this.isDefaultValue = false
        this.$emit('change', value, { isDefaultValue: this.isDefaultValue })
      },
      handleBlur () {
        this.focus = false
        this.$emit('on-blur')
      },
      handleFocus () {
        this.focus = true
        this.$emit('on-focus')
      },
      renderTip (h) {
        if (this.focus) {
          return
        }
        if (!this.isDefaultValue || !this.defaultValueTip) {
          return
        }
        return h('div', { class: 'with-default-value-tip' }, [this.defaultValueTip])
      }
    },
    render (h) {
      const { 'on-change': onChange, 'on-focus': onFocus, 'on-blur': onBlur, ...rest } = this.$listeners
      const value = this.isDefaultValue ? this.defaultValue : this.value
      const node = h(WrapperComponent, {
        props: {
          value
        },
        attrs: { ...this.$attrs, value },
        on: {
          ...rest,
          'on-focus': this.handleFocus,
          'on-blur': this.handleBlur,
          'change': this.handleChange
        },
        scopedSlots: this.$scopedSlots
      })
      const tip = this.renderTip(h)
      return h('div', { style: { 'position': 'relative' } }, [node, tip])
    },
    mounted () {
      if (this.isDefaultValue) {
        this.$emit('change', this.defaultValue, { isDefaultValue: this.isDefaultValue })
      }
    }
  })
}
