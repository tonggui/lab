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
      const attrContext = this.attrContext || {}
      const attrList = this.attrList || []
      attrList.forEach(attr => {
        if (attr.required) {
          const data = attrContext[attr.id] || {}
          attrContext[attr.id] = {
            ...data,
            container: [...(data.container || []), container]
          }
        }
      })
      return attrContext
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
