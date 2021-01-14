import Vue from 'vue'
import { isEqual, trim } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

// 参考 src/views/components/product-form/components/audit-field-tip
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
    // 对比逻辑，触发纠错，并且 当前值和初始值不一致
    show () {
      if (this.needCorrectionAudit) {
        const oldValue = typeof this.original === 'string' ? trim(this.original) : this.original
        const newValue = typeof this.value === 'string' ? trim(this.value) : this.value
        const value = this.formatter(newValue) || ''
        const original = this.formatter(oldValue) || ''
        return !isEqual(value, original)
      }
      return false
    }
  },
  methods: {
    // 渲染提示
    renderTips (h) {
      return h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'correct-desc', style: { width: '300px' } }, [`纠错前：${this.formatter(this.original) || '空'}`])
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
