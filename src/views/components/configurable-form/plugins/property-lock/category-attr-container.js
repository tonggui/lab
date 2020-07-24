import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import Layout from './layout'
import CategoryAttrs from '@/views/components/configurable-form/components/category-attrs'

export default Vue.extend({
  name: 'category-attr-property-lock-container',
  props: {
    disabled: Boolean,
    locked: Boolean,
    attrList: Array,
    attrContext: Object
  },
  computed: {
    combineAttrContext () {
      if (!this.locked || this.disabled) {
        return this.attrContext
      }
      return (this.attrList || []).reduce((prev, attr) => {
        if (attr.required) {
          prev[attr.id] = prev[attr.id] || { layout: [] }
          prev[attr.id].layout.push(Layout)
        }
        return prev
      }, this.attrContext || {})
    }
  },
  render (h) {
    return forwardComponent(this, CategoryAttrs, {
      props: {
        disabled: this.disabled,
        attrContext: this.combineAttrContext,
        attrList: this.attrList
      }
    })
  }
})
