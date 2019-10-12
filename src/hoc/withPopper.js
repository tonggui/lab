import Vue from 'vue'

export default (Component) => Vue.extend({
  props: {
    value: Boolean
  },
  created () {
    this.instance = null
  },
  methods: {
    createInstance (h, props = {}) {
      return h(Component, {
        attrs: {
          ...this.$attrs,
          value: this.value,
          ...props
        },
        on: this.$listeners,
        scopedSlots: this.$scopedSlots,
        slots: this.$slots
      })
    }
  },
  render (h) {
    if (!this.instance && !this.value) {
      return null
    }
    if (!this.instance && this.value) {
      this.instance = this.createInstance(h, { value: false })
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    } else {
      this.instance = this.createInstance(h)
    }
    return this.instance
  }
})
