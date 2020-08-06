import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

export default (WrapperComponent) => Vue.extend({
  name: 'with-anchor',
  props: {
    anchor: Object
  },
  computed: {
    anchorInfo () {
      if (!this.anchor || !this.anchor.link) {
        return {}
      }
      return { id: this.anchor.link.replace(/^#(\w*)$/, '$1') }
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      domProps: {
        ...this.anchorInfo
      }
    })
  }
})
