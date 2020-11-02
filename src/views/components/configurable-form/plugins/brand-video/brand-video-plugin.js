import { SPU_FIELD } from '@/views/components/configurable-form/field'
import brandVideoContainer from './brand-video-container'

export default () => ({
  name: '_combineBrandVideo_',
  config: [{
    key: SPU_FIELD.PRODUCT_VIDEO,
    container: brandVideoContainer,
    options: {
      brandVideoEnabled: false
    },
    rules: []
  }]
})
