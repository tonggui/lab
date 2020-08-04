import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import hoc from './with-audit-tips'
import { get } from 'lodash'

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-audit-tips-container',
  props: ['original', 'approve', 'attrList', 'attrContext'],
  computed: {
    combineAttrContext () {
      return (this.attrList || []).reduce((prev, attr) => {
        prev[attr.id] = prev[attr.id] || {}
        if (!prev[attr.id].container) {
          prev[attr.id].container = []
        }
        if (!prev[attr.id].options) {
          prev[attr.id].options = {}
        }
        prev[attr.id].options = {
          ...prev[attr.id].options,
          original: get(this.original, `${attr.id}`),
          approve: get(this.approve, `${attr.id}`)
        }
        prev[attr.id].container.push(hoc)
        return prev
      }, this.attrContext || {})
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
