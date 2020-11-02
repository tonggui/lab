import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import ProductVideoWithBrandVideo from '@/views/components/configurable-form/components/product-video-with-brand/index'

export default (WrapperComponent) => Vue.extend({
  props: {
    brandVideoEnabled: Boolean
  },
  render (createElement, context) {
    if (this.brandVideoEnabled) {
      return forwardComponent(this, ProductVideoWithBrandVideo)
    } else {
      return forwardComponent(this, WrapperComponent)
    }
  }
})
