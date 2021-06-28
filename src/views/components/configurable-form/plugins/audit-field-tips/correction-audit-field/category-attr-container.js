import Vue from 'vue'
import tipContainer from './container'
import { forwardComponent } from '@/common/vnode'
import { get } from 'lodash'
import { RENDER_TYPE, ATTR_TYPE } from '@/data/enums/category'
import {
  categoryAttrSelectorFormatterHOC,
  categoryAttrCascadeFormatterHOC
} from '../formatter'

// 参考 src/views/components/product-form/components/audit-field-tip

// 由于 tip 组件需要获取 original和approve 值，因此采用了inject和provide的方式
// TODO 建议优化
const injectContainer = (WrapperComponent) => Vue.extend({
  inject: ['correctionAuditFieldTip'],
  props: ['attr'],
  render (h) {
    const original = get(this.correctionAuditFieldTip, `original[${this.attr.id}]`)
    const needCorrectionAudit = get(this.correctionAuditFieldTip, 'needCorrectionAudit')
    const businessNeedAudit = get(this.correctionAuditFieldTip, 'businessNeedAudit')
    const complianceNeedAuditTip = get(this.correctionAuditFieldTip, 'complianceNeedAuditTip')
    return forwardComponent(this, WrapperComponent, {
      props: {
        original,
        needCorrectionAudit,
        attr: this.attr,
        complianceNeedAuditTip,
        businessNeedAudit
      }
    })
  }
})

export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-correction-audit-field',
  props: ['original', 'needCorrectionAudit', 'attrList', 'attrContext', 'businessNeedAudit', 'complianceNeedAuditTip'],
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
        // 只处理关键属性
        if (attr.attrType !== ATTR_TYPE.SPECIAL) {
          return
        }
        const data = attrContext[attr.id] || {}
        const containerList = [tipContainer]
        // select 格式化 container
        if (attr.render.type === RENDER_TYPE.SELECT) {
          containerList.push(categoryAttrSelectorFormatterHOC)
        } else if ([RENDER_TYPE.CASCADE, RENDER_TYPE.BRAND].includes(attr.render.type)) {
          // 及联/brand 类型 格式化 container
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
