import Vue from 'vue'
import { isEqual } from 'lodash'
import { cloneElement, forwardComponent } from '@/common/vnode'
import './index.less'

const DiffTableCellContainer = Vue.extend({
  name: 'DiffTableCellContainer',
  props: {
    // 解决层级变化导致DOM切换引起的光标丢失问题
    active: Boolean,
    originalValue: Array
  },
  render (h) {
    const contentScope = this.$scopedSlots.content
    const content = cloneElement(contentScope(), {
      props: {
        ...this.$attrs
      },
      on: this.$listeners
    })
    return h('div', { class: 'correction-audit-field-container' }, [
      h('div', { class: 'correction-audit-field' }, [content]),
      this.active ? h('div', { class: 'correction-audit-field-tip' }, [
        h('p', { class: 'correct-desc' }, [`纠错前`]),
        this.originalValue.map((img) => {
          return h('img', { class: 'correct-img', attrs: { src: img } })
        })
      ]) : null
    ])
  }
})

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
        return !isEqual(this.value, this.original)
      }
      return false
    }
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value
      }
    })
    return h(DiffTableCellContainer, {
      props: {
        active: this.show,
        originalValue: this.original
      },
      scopedSlots: {
        content: () => content
      }
    })
  }
})
