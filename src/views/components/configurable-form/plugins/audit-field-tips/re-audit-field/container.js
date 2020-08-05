import Vue from 'vue'
import Icon from '@/components/icon/icon'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

export default (WrapperComponent) => Vue.extend({
  name: 'width-re-audit-field-tips',
  props: {
    original: [Object, Number, String, Array],
    approve: [Object, Number, String, Array],
    value: [Object, Number, String, Array],
    formatter: {
      type: Function,
      default: (v) => v
    }
  },
  computed: {
    show () {
      const approve = this.formatter(this.approve)
      const original = this.formatter(this.original)
      const value = this.formatter(this.value)
      return !isEqual(approve, original) && isEqual(original, value)
    }
  },
  methods: {
    renderTips (h) {
      if (this.show) {
        return h('div', { class: 'audit-field-tip' }, [h(Icon, { props: { type: 'error' } }), '审核人对所填信息有调整，如有误请修改并重新提交审核'])
      }
      return null
    }
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        original: this.original,
        approve: this.approve
      }
    })
    if (!this.show) {
      return content
    }
    return h('div', { class: 'audit-field-container' }, [h('div', { class: 'audit-field' }, [content]), this.renderTips(h)])
  }
})
