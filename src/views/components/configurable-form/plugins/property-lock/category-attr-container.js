import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import container from './container'

// 给类目属性绑定的字段锁定container
// 由于类目属性是 动态表单嵌套，并且属性动态生成
// 因此，简单的通过attrContext => 中的 container 列表，进行 类目属性的包裹，从而实现额外功能
// TODO 此方式不是很优雅，建议考虑更合适的方式
export default (WrapperComponent) => Vue.extend({
  name: 'category-attr-property-lock-container',
  props: {
    disabled: Boolean,
    attrList: Array,
    attrContext: Object
  },
  computed: {
    // 进行container的计算
    combineAttrContext () {
      // 如果字段已锁定，说明不是字段锁定导致的锁定，忽略
      if (this.disabled) {
        return this.attrContext
      }
      // 字段锁定更新
      const attrContext = this.attrContext || {}
      const attrList = this.attrList || []
      attrList.forEach(attr => {
        // 必填的属性，才进行包裹
        if (attr.required) {
          const data = attrContext[attr.id] || {}
          attrContext[attr.id] = {
            ...data,
            container: [...(data.container || []), container]
          }
        }
      })
      return attrContext
    }
  },
  render (h) {
    // 传递 attrContext
    return forwardComponent(this, WrapperComponent, {
      props: {
        disabled: this.disabled,
        attrContext: this.combineAttrContext,
        attrList: this.attrList
      }
    })
  }
})
