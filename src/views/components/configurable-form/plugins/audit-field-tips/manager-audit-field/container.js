import Vue from 'vue'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

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
    renderTips (h) {
      return h('div', { class: 'manager-audit-field-tip' }, [
        h('p', [`修改前：${this.formatter(this.snapshot) || '空'}`])
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
