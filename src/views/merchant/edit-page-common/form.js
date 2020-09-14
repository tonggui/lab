import createForm from '@/views/components/configurable-form/instance/common-form'
import MerchantFormComponents from './components'

const createMerchantForm = ({
  components = {},
  plugins = [],
  fieldConfig = {}
}) => createForm({
  components: {
    ...MerchantFormComponents,
    ...components
  },
  plugins,
  fieldConfig
})

export default createMerchantForm
