import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import LightForm from '../../../components/form-template'
import configs from './step-poi-config'
import StepFoot from './foot'

export default Vue.extend({
  name: 'step-poi',
  render (h) {
    return forwardComponent(this, LightForm, {
      props: {
        configs
      },
      scopedSlots: {
        default: () => {
          return h(StepFoot, {
            attrs: this.$attrs,
            on: this.$listeners
          })
        }
      }
    })
  }
})
