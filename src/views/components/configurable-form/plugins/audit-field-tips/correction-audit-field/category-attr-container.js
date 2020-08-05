import Vue from 'vue'
import tipContainer from './container'
import { forwardComponent } from '@/common/vnode'
import { get } from 'lodash'
import { RENDER_TYPE, ATTR_TYPE } from '@/data/enums/category'
import {
  categoryAttrSelectorFormatterHOC,
  categoryAttrCascadeFormatterHOC
} from '../formatter'

const injectContainer = (WrapperComponent) => Vue.extend({
  inject: ['correctionAuditFieldTip'],
  props: ['attr'],
  render (h) {
    const original = get(this.correctionAuditFieldTip, `original[${this.attr.id}]`)
    const needCorrectionAudit = get(this.correctionAuditFieldTip, 'needCorrectionAudit')
    return forwardComponent(this, WrapperComponent, {
      props: {
        original,
        needCorrectionAudit,
        attr: this.attr
      }
    })
  }
})

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-correction-audit-field',
  props: ['original', 'needCorrectionAudit', 'attrList', 'attrContext'],
  provide () {
    return {
      correctionAuditFieldTip: this
    }
  },
  computed: {
    combineAttrContext () {
      const attrContext = { ...(this.attrContext || {}) }
      const attrList = this.attrList || []
      attrList.forEach((attr) => {
        if (attr.attrType !== ATTR_TYPE.SPECIAL) {
          return
        }
        const data = attrContext[attr.id] || {}
        const containerList = [tipContainer]
        if (attr.render.type === RENDER_TYPE.SELECT) {
          containerList.push(categoryAttrSelectorFormatterHOC)
        } else if ([RENDER_TYPE.CASCADE, RENDER_TYPE.BRAND].includes(attr.render.type)) {
          containerList.push(categoryAttrCascadeFormatterHOC)
        }
        attrContext[attr.id] = {
          ...data,
          container: [...(data.container || []), ...containerList, injectContainer]
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
