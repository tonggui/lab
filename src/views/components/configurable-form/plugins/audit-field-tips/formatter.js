import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

// 参考 src/views/components/product-form/components/audit-field-tip
/**
 * 审核前后对比相关的 对比格式化函数
 * TODO 此对比函数 formatter和 渲染的组件数据格式息息相关，但是直接分离写在外部，不是很妥当
 * TODO 是否考虑穿透的去获取组件内部的formatter函数
 */

// 类目对比 formatter
export const categoryFormatterHOC = (WrapperComponent) => Vue.extend({
  props: ['separator'],
  methods: {
    formatter (category) {
      return ((category || {}).namePath || []).join(this.separator || '>')
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        formatter: this.formatter,
        separator: this.separator
      }
    })
  }
})
// 商品名称/图片 对比formatter
export const BasicFormatterHOC = (WrapperComponent) => Vue.extend({
  methods: {
    formatter (field) {
      return field
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        formatter: this.formatter
      }
    })
  }
})

// 单选/多选 类目属性对比 formatter
export const categoryAttrSelectorFormatterHOC = (WrapperComponent) => Vue.extend({
  props: ['attr'],
  methods: {
    formatter (v) {
      const source = this.attr.options || []
      return [].concat(v).map(v => source.find(s => s.id === v))
        .filter(v => v !== undefined)
        .map(v => v.name)
        .join('、')
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        formatter: this.formatter,
        attr: this.attr
      }
    })
  }
})
// 及联 类目属性对比 formatter
export const categoryAttrCascadeFormatterHOC = (WrapperComponent) => Vue.extend({
  methods: {
    formatter (v) {
      return [].concat(v).filter(v => v).map(i => (i.namePath || []).join('/')).toString()
    }
  },
  render () {
    return forwardComponent(this, WrapperComponent, {
      props: {
        formatter: this.formatter
      }
    })
  }
})
