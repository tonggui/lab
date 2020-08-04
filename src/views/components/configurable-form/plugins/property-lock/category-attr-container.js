import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import container from './container'

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-property-lock-container',
  props: {
    disabled: Boolean,
    attrList: Array,
    attrContext: Object
  },
  computed: {
    combineAttrContext () {
      if (this.disabled) {
        return this.attrContext
      }
      return (this.attrList || []).reduce((prev, attr) => {
        if (attr.required) {
          prev[attr.id] = prev[attr.id] || {}
          if (!prev[attr.id].container) {
            prev[attr.id].container = []
          }
          prev[attr.id].container.push(container)
        }
        return prev
      }, this.attrContext || {})
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disabled,
        attrContext: this.combineAttrContext,
        attrList: this.attrList
      }
    })
  }
})
