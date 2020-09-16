import Vue from 'vue'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

// 参考 src/views/components/product-form/components/audit-field-tip
export default (WrapperComponent) => Vue.extend({
  name: 'width-manager-audit-field-tips',
  props: {
    snapshot: [Object, Number, String, Array],
    value: [Object, Number, String, Array],
    formatter: {
      type: Function,
      default: (v) => v
    },
    showTip: Boolean
  },
  computed: {
    // 对比逻辑，当前的值和上次提审的快照不相同，则属于用户纠错了
    show () {
      if (this.showTip) {
        const snapshot = this.formatter(this.snapshot)
        const value = this.formatter(this.value)
        return !isEqual(snapshot, value)
      }
      return false
    }
  },
  methods: {
    // 渲染提示
    renderTips (h) {
      return h('div', { class: 'manager-audit-field-tip' }, [
        h('p', [`纠错前：${this.formatter(this.snapshot) || '空'}`])
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
    return h('div', { class: 'manager-audit-field-container' }, [
      h('div', { class: 'manager-audit-field' }, [content]),
      this.renderTips(h)
    ])
  }
})
