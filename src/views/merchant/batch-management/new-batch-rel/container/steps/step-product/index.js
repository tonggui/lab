import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import LightForm from '../../../components/form-template'
import configs from './step-product-config'
import StepFoot from './foot'

export default Vue.extend({
  name: 'step-product',
  render (h) {
    return forwardComponent(this, LightForm, {
      props: {
        configs
      },
      scopedSlots: {
        default: (props) => {
          return h(StepFoot, {
            props,
            on: this.$listeners
          })
        }
      }
    })
  }
})
