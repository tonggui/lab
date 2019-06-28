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
    const { type, value, options, directives, children = [] } = this.config
    return h(
      type,
      {
        props: {
          value,
          ...options
        },
        directives,
        scopedSlots: {
          default: props => h('div', children.map(config => h('FormItemContainer', {
            key: config.key + config.type,
            props: {
              config
            },
            directives: [
              {
                name: 'show',
                value: config.visible === undefined ? true : config.visible,
                expression: 'config.visible === undefined ? true : config.visible'
              }
            ],
            on: config.events || {},
            scopedSlots: {
              content: props => h('form-item', {
                props: {
                  config
                }
              })
            }
          })))
        },
        on: this.config.events || {}
      }
    )
  }
}))
