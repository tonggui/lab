import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import hoc from './with-audit-tips'
import { get } from 'lodash'

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-audit-tips-container',
  props: ['original', 'approve', 'attrList', 'attrContext'],
  computed: {
    combineAttrContext () {
      const attrContext = { ...(this.attrContext || {}) }
      const attrList = this.attrList || []
      attrList.forEach((attr) => {
        const data = attrContext[attr.id] || {}
        attrContext[attr.id] = {
          ...data,
          container: [...(data.container || []), hoc],
          options: Object.assign({}, data.options, {
            original: get(this.original, `${attr.id}`),
            approve: get(this.approve, `${attr.id}`)
          })
        }
      })
      return attrContext
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      props: {
        attrContext: this.combineAttrContext,
        attrList: this.attrList
      }
    })
  }
})
