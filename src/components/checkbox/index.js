export default {
  name: 'CheckboxPro',
  inheritAttrs: false,
  props: {
    value: Boolean
  },
  data () {
    return {
      val: this.value
    }
  },
  watch: {
    value (v, ov) {
      this.val = v
    }
  },
  methods: {
    handleChange (v) {
      this.val = v
      this.$emit('on-change', v)
    },
    handleInput (v) {
      this.val = v
      this.$emit('input', v)
    }
  },
  render (h) {
    return h(
      'Checkbox',
      {
        attrs: {
          ...this.$attrs,
          value: this.val
        },
        on: {
          input: this.handleInput,
          'on-change': this.handleChange
        },
        scopedSlots: this.$scopedSlots
      },
      this.$slots.default
    )
  },
  updated () {
    if (this.value !== this.val) {
      this.val = this.value
    }
  }
}
