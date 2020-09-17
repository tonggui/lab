import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

/**
 * attribute 高阶函数
 * 由于动态表单 options 是个整体，但是外部context可能需要动态配置部分options，非固定
 * 暂时就将 context 中配置的options 都转换成 attribute 字段，通过此高阶函数，把 attribute 解构出去
 * !!! TODO 很需要优化 !!!
 */
export default (WrapperComponent) => Vue.extend({
  name: 'with-attribute',
  props: {
    attribute: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    return forwardComponent(this, WrapperComponent, {
      props: {
        ...this.attribute
      }
    })
  }
})
