import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import LightForm from '../../../components/LightForm'
import configs from './step-product-config'

export default Vue.extend({
  name: 'step-product',
  render () {
    return forwardComponent(this, LightForm, {
      props: {
        configs
      }
    })
  }
})
