import Vue from 'vue'
import { cloneElement } from '@/common/vnode'

export default Vue.extend({
  name: 'property-lock-layout',
  props: {
    disabled: Boolean
  },
  render (h) {
    // 如果 外部已经disabled 则不是字段锁定导致的disabled，直接返回
    if (this.disabled) {
      return this.$slots.default
    }
    // 字段锁定则提示
    return h('Tooltip', {
      attrs: {
        content: '当前字段锁定，如需修改请联系业务经理',
        placement: 'top',
        maxWidth: 300
      }
    }, [cloneElement(this.$slots.default, {
      props: {
        disabled: true
      }
    })])
  }
})
