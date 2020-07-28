import Vue from 'vue'
import renderFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/render-item'

export default (FormItem, form) => Vue.extend({
  name: 'form-container',
  props: {
    columnCount: Number,
    columnGap: Number
  },
  components: {
    FormItem
  },
  render (h) {
    return h('div', {
      class: 'form',
      style: {
        'column-count': this.columnCount,
        'column-gap': `${this.columnGap}px`
      }
    }, form.config.map(c => renderFormItem(h, c)))
  }
})
