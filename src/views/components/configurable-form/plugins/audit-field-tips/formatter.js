import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'

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
