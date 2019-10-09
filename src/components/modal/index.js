import Vue from 'vue'
import Modal from './modal'

// TODO modal-manage
// const $node = document.createElement('div')
// $node.id = 'modal-root'
// document.body.appendChild($node)

export default Vue.extend({
  props: {
    value: Boolean
  },
  created () {
    this.instance = null
  },
  methods: {
    createInstance (h, props = {}) {
      return h(Modal, {
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
