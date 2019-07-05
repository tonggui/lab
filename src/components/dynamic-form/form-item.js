import Vue from 'vue'
import validatorMixin from './validator/validator'

export default (components) => (Vue.extend({
  name: 'form-item',
  components,
  mixins: [validatorMixin],
  props: {
    config: Object
  },
  render (h) {
    const {
      type, value, visible,
      options, events,
      layout = 'FormItemContainer'
    } = this.config

    const defaultChild = this.$item = h(type, {
      props: {
        value,
        ...options
      },
      directives: [
        {
          name: 'show',
          value: visible === undefined ? true : visible,
          expression: 'visible === undefined ? true : visible'
        }
      ],
      on: events || {}
    })

    if (layout) {
      return h(layout, {
        props: {
          config: this.config
        },
        directives: [
          {
            name: 'show',
            value: visible === undefined ? true : visible,
            expression: 'config.visible === undefined ? true : config.visible'
          }
        ]
      }, [defaultChild])
    } else {
      return defaultChild
    }
  }
}))
