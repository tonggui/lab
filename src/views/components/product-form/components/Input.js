import { Input } from '@roo-design/roo-vue'
export default {
  functional: true,
  // props: Input.props,
  render (h, context) {
    if (context.props) {
      const { disabled, clearable } = context.props
      if (disabled && clearable) {
        context.props.clearable = false
      }
    }
    return h(Input, context.data, context.children)
  }
}
