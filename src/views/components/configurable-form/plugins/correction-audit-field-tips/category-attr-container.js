import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import hoc from './with-correction-audit-tips'
import { get } from 'lodash'
import { ATTR_TYPE, RENDER_TYPE } from '@/data/enums/category'
import {
  categoryAttrSelectorFormatterHOC,
  categoryAttrCascadeFormatterHOC
} from './formatter'

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-correction-audit-tips-container',
  props: ['original', 'attrList', 'attrContext'],
  computed: {
    combineAttrContext () {
      const attrContext = { ...(this.attrContext || {}) }
      const attrList = this.attrList || []
      attrList.forEach((attr) => {
        const data = attrContext[attr.id] || {}
        if (attr.attrType === ATTR_TYPE.SPECIAL) {
          const container = [hoc]
          if (attr.render.type === RENDER_TYPE.SELECT) {
            container.push(categoryAttrSelectorFormatterHOC)
          } else if ([RENDER_TYPE.CASCADE, RENDER_TYPE.BRAND].includes(attr.render.type)) {
            container.push(categoryAttrCascadeFormatterHOC)
          }
          attrContext[attr.id] = {
            ...data,
            container: [...(data.container || []), ...container],
            options: Object.assign({}, data.options || {}, { original: get(this.original, `${attr.id}`) })
          }
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
