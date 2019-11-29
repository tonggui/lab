import { Input } from '@roo-design/roo-vue'
import { forwardComponent } from '@/common/vnode'
export default {
  name: 'custom-input',
  props: {
    clearable: Boolean,
    disabled: Boolean
  },
  computed: {
    _clearable () {
      return (this.clearable && this.disabled) ? false : this.clearable
    }
  },
  render (h, context) {
    return forwardComponent(this, Input, {
      props: {
        clearable: this._clearable
      }
    })
  }
}
