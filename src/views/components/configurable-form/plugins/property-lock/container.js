import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

export default (WrapperComponent) => Vue.extend({
  name: 'property-lock-container',
  props: {
    disabled: Boolean
  },
  render (h) {
    const content = forwardComponent(this, WrapperComponent, { props: { disabled: true } })
    // 如果 外部已经disabled 则不是字段锁定导致的disabled，直接返回
    if (this.disabled) {
      return content
    }
    // 字段锁定则提示
    return h('Tooltip', {
      style: {
        width: '100%'
      },
      attrs: {
        content: '当前字段锁定，如需修改请联系业务经理',
        placement: 'top',
        maxWidth: 300
      }
    }, [content])
  }
})
