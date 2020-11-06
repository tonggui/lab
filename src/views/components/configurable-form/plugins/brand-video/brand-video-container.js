import Vue from 'vue'
import { get, omit } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import ProductVideoWithBrandVideo from '@/views/components/configurable-form/components/product-video-with-brand/index'

export default (WrapperComponent) => Vue.extend({
  name: 'ProductBrandVideoContainer',
  props: {
    brandVideoEnabled: Boolean,
    brandVideoEditable: Boolean,
    brandVideo: {
      default: () => null
    },
    autoUse: Boolean
  },
  render (createElement, context) {
    if (this.brandVideoEnabled) {
      return forwardComponent(this, ProductVideoWithBrandVideo, {
        props: {
          brandVideo: omit(this.brandVideo, 'status') || null,
          brandVideoStatus: get(this.brandVideo, 'status', 0),
          brandVideoEditable: this.brandVideoEditable,
          autoUse: this.autoUse
        }
      })
    } else {
      return forwardComponent(this, WrapperComponent)
    }
  }
})
