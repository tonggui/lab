import Vue from 'vue'
import { forwardComponent } from '@/common/vnode'
import LightForm from '../../components/form-template'
import configs from './step-poi-config'

export default Vue.extend({
  name: 'step-poi',
  render () {
    return forwardComponent(this, LightForm, {
      props: {
        configs
      }
    })
  }
})
