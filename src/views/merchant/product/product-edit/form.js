import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'

import { fetchGetTagList } from '@/data/repos/merchantCategory'
import {
  fetchGetSuggestCategoryByProductName
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/merchantProduct'

const plugins = [
  createTagListPlugin({
    getTagList: fetchGetTagList
  }),
  createCategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  }),
  createPropertyLockPlugin()
]

export default createForm({ plugins })
