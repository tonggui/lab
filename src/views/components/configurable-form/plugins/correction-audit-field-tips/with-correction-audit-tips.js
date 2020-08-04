import Vue from 'vue'
import { Tag } from '@roo-design/roo-vue'
import { isEqual } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import './index.less'

export default (WrapperComponent) => Vue.extend({
  name: 'width-correction-audit-tips',
  props: ['original', 'value', 'formatter'],
  computed: {
    show () {
      return !isEqual(this.value, this.original)
    }
  },
  methods: {
    renderTips (h) {
      if (this.show) {
        const formatter = this.formatter || ((v) => v)
        return h('div', { class: 'correction-audit-field-tip' }, [
          h('p', { class: 'error' }, [h(Tag, { props: { color: 'error' } }, ['需审核']), '修改后需进行审核，待审核通过后才可售卖']),
          h('p', { class: 'desc' }, [`修改前：${formatter(this.original) || '空'}`])
        ]
        )
      }
      return null
    }
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        original: this.original
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
