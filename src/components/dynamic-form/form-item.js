import Vue from 'vue'
import { pick } from 'lodash'
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
      type, value, visible, disabled,
      options, events, error,
      layout = 'FormItemContainer'
    } = this.config
    const renderProps = pick(options, ['class', 'style'])

    const defaultChild = this.$item = h(type, {
      class: renderProps.class,
      style: renderProps.style,
      attrs: {
        value,
        disabled,
        error,
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
        props: this.config,
        directives: [
          {
            name: 'show',
            value: visible === undefined ? true : visible,
            expression: 'visible === undefined ? true : visible'
          }
        ]
      }, [defaultChild])
    } else {
      return defaultChild
    }
  }
}))
