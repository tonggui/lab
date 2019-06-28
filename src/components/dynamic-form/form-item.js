import Vue from 'vue'
export default (customComponents = {}) => (Vue.extend({
  name: 'form-item',
  components: customComponents,
  props: {
    config: {
      type: Object
    }
  },
  render (h) {
    const { type, value, options, directives } = this.config
    return h(
      type,
      {
        props: {
          value,
          ...options
        },
        directives,
        on: this.config.events || {}
      }
    )
  }
}))
