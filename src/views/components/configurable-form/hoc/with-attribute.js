import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

export default (WrapperComponent) => Vue.extend({
  name: 'with-attribute',
  props: {
    attribute: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      props: {
        ...this.attribute
      }
    })
  }
})
