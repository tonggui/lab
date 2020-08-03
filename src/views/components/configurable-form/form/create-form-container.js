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
  methods: {
    renderFormItem (h, config) {
      return renderFormItem(h, config)
    },
    renderByGroup (h) {
      const result = []
      const size = form.config.length
      let i = 0
      while (i < size) {
        const $child = []
        for (let j = 0; j < this.columnCount; j++) {
          const index = i + j
          if (index >= size) {
            break
          }
          $child.push(<div style={`margin-right: ${this.columnGap}px`}>{ this.renderFormItem(h, form.config[index]) }</div>)
        }
        result.push(<div style="display: flex">{ $child }</div>)
        i += this.columnCount
      }
      return result
    }
  },
  render (h) {
    const node = this.columnCount > 1 ? this.renderByGroup(h) : form.config.map((item) => this.renderFormItem(h, item))
    return h('div', {
      class: 'form'
    }, node)
  }
})
