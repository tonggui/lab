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
    this.initial = true
  },
  render (h) {
    if (this.initial && !this.value) {
      return null
    }
    this.initial = false
    return h(Modal, {
      attrs: {
        ...this.$attrs,
        value: this.value
      },
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      slots: this.$slots
    })
  }
})
