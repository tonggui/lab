import Vue from 'vue'
import Icon from '@/components/icon/icon'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'

export default (WrapperComponent) => Vue.extend({
  name: 'width-audit-tips',
  props: ['original', 'approve', 'value'],
  computed: {
    show () {
      return !isEqual(this.approve, this.original) && isEqual(this.original, this.value)
    }
  },
  methods: {
    renderTips (h) {
      if (this.show) {
        return h('div', { class: 'auditor-change-tip' }, [h(Icon, { props: { type: 'error' } }), '审核人对所填信息有调整，如有误请修改并重新提交审核'])
      }
      return null
    }
  },
  render (h) {
    return h('div', [forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value
      }
    }), this.renderTips(h)])
  }
})
