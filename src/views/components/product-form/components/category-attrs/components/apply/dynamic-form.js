import register from '@sgfe/dynamic-form-vue/src/components/dynamic-form'

import FormItemLayout from '@/views/components/product-form/form-item-layout'
import Input from './input'
import ApplySection from './section'
import UploadGroup from './upload-group'

const customComponents = {
  Input,
  ApplySection,
  UploadGroup
}

export default function (formConfig) {
  return register({ components: customComponents, FormItemContainer: FormItemLayout })(formConfig)
}
