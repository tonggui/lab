import Vue from 'vue'
import { Tag } from '@roo-design/roo-vue'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

export default (WrapperComponent) => Vue.extend({
  name: 'width-correction-audit-tips',
  props: {
    original: [Object, Number, String, Array],
    value: [Object, Number, String, Array],
    formatter: {
      type: Function,
      default: (v) => v
    },
    needCorrectionAudit: Boolean
  },
  computed: {
    show () {
      if (this.needCorrectionAudit) {
        const value = this.formatter(this.value) || ''
        const original = this.formatter(this.original) || ''
        return !isEqual(value, original)
      }
      return false
    }
  },
  methods: {
    renderTips (h) {
      return h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'error' }, [h(Tag, { props: { color: 'error' } }, ['需审核']), '修改后需进行审核，待审核通过后才可售卖']),
        h('p', { class: 'desc' }, [`修改前：${this.formatter(this.original) || '空'}`])
      ]
      )
    }
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value
      }
    })
    if (!this.show) {
      return content
    }
    return h('div', { class: 'correction-audit-field-container' }, [
      h('div', { class: 'correction-audit-field' }, [content]),
      this.renderTips(h)
    ])
  }
})
