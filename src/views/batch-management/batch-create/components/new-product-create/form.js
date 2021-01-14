import createForm from '@/views/components/configurable-form/instance/common-form'
import CategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSuggestCategoryPlugin
  from '@/views/components/configurable-form/plugins/suggest-category'
import { fetchGetCategoryAppealInfo } from '@/data/repos/product'
import { fetchGetSuggestCategoryByProductName } from '@/data/repos/category'

import TagInput from './tag-input'

const plugins = [
  CategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createPropertyLockPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  })
]

export default createForm({
  plugins,
  components: {
    TagList: TagInput
  }
})
