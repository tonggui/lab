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
  methods: {
    ...Object.keys(WrapperComponent.methods || {})
      .reduce(function (map, key) {
        map[key] = function (...args) {
          return this.$refs['impl'][key](...args)
        }
        return map
      }, {})
  },
  render (h) {
    if (!this.create_$) return h('div', { style: { display: 'none' } })
    return h(WrapperComponent, {
      props: this.$props,
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      ref: 'impl'
    }, this.$children)
  }
})
