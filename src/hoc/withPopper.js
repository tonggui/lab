import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

export default (Component) => Vue.extend({
  props: {
    value: Boolean
  },
  created () {
    this.instance = null
  },
  methods: {
    createInstance (props = {}) {
      return forwardComponent(this, Component, {
        props: {
          ...props,
          value: this.value
        }
      })
    }
  },
  render () {
    if (!this.instance && !this.value) {
      return null
    }
    if (!this.instance && this.value) {
      this.instance = this.createInstance({ value: false })
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    } else {
      this.instance = this.createInstance()
    }
    return this.instance
  }
})
