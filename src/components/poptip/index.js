import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import { Poptip } from '@roo-design/roo-vue'
import omit from 'lodash/omit'

export default Vue.extend({
  name: 'CustomPoptip',
  data () {
    return {
      renderContentSlot: 'value' in this.$attrs ? this.$attrs.value : false
    }
  },
  methods: {
    handlePopShown () {
      this.renderContentSlot = true
    }
  },
  render () {
    const context = Object.create(this)
    if (!this.renderContentSlot) {
      context.$slots = omit(context.$slots, ['content'])
      context.$scopedSlots = omit(context.$scopedSlots, ['content'])
    }
    return forwardComponent(context, Poptip, {
      on: {
        ...context.$listeners,
        input: v => {
          this.$emit('input', v)
          if (v) {
            this.handlePopShown()
          }
        }
      }
    })
  }
})
