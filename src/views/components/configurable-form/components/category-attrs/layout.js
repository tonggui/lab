import Vue from 'vue'
import FormItemLayout from '@/views/components/configurable-form/components/form-item-layout'

export default (layoutList = []) => Vue.extend({
  render (h) {
    const defaultSlot = layoutList.reduce((prev, layout) => {
      return h(layout, {
        attrs: { ...this.$attrs },
        on: { ...this.$listeners }
      }, [prev])
    }, this.$slots.default)
    return h(FormItemLayout, {
      attrs: { ...this.$attrs },
      on: { ...this.$listeners }
    }, [defaultSlot])
  }
})
