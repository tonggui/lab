import register from '@sgfe/dynamic-form-vue/src/components/dynamic-form'

import FormItemLayout from './form-item-layout'
import Input from './input'
import ApplySection from './section'
import UploadGroup from './upload-group'
import UploadBox from './upload-box'

const customComponents = {
  Input,
  ApplySection,
  UploadGroup,
  UploadBox
}

export default function (formConfig) {
  return register({ components: customComponents, FormItemContainer: FormItemLayout })(formConfig)
}
