/*
 * @description
 *   Please write the onlyone script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-18)
 */
import Vue from 'vue'
import { pascalCase } from '@/common/utils'

export default (WrapperComponent) => Vue.extend({
  name: 'Onlyone' + pascalCase(WrapperComponent.name),
  props: WrapperComponent.props,
  data () {
    return {
      create_$: false
    }
  },
  render (h, context) {
    if (!this.create_$) return h('div', { style: { display: 'none' } })
    return h(WrapperComponent, {
      props: this.$props,
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    }, this.$children)
  }
})
