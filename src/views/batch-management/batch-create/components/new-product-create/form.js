import createForm from '@/views/components/configurable-form/instance/common-form'
import CategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'

import TagInput from './tag-input'

const plugins = [
  CategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createPropertyLockPlugin()
]

export default createForm({
  plugins,
  components: {
    TagList: TagInput
  }
})
