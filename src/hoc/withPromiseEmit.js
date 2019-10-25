import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import { wrapperEmitWithCallback, createCallback } from '@/common/vuex'

export default (Component) => Vue.extend({
  created () {
    this.instance = null
  },
  methods: {
    wrapperEmit () {
      return Object.entries(this.$listeners).reduce((prev, [key, fn]) => {
        prev[key] = wrapperEmitWithCallback(fn, this.instance)
        return prev
      }, {})
    },
    createInstance () {
      const $listener = this.wrapperEmit()
      this.instance = forwardComponent(this, Component, {
        on: $listener,
        props: {
          createCallback
        }
      })
      return this.instance
    }
  },
  render (h) {
    return this.createInstance()
  }
})
