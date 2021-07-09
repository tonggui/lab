import Vue from 'vue'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

// 参考 src/views/components/product-form/components/audit-field-tip
export default (WrapperComponent) => Vue.extend({
  name: 'width-correction-audit-tips',
  props: {
    original: [Object, Number, String, Array, Boolean],
    value: [Object, Number, String, Array, Boolean],
    formatter: {
      type: Function,
      default: (v) => v
    },
    needCorrectionAudit: Boolean,
    visible: Boolean
  },
  computed: {
    // 对比逻辑，触发纠错，并且 当前值和初始值不一致
    show () {
      if (this.visible) {
        const value = this.formatter(this.value) || ''
        const original = this.formatter(this.original) || ''
        return !isEqual(value, original)
      }
      return false
    }
  },
  methods: {
    // 渲染提示
    renderTips (h) {
      return h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'popper' }, [h('div', { class: 'popper-arrow' }), '修改需审核'])
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
