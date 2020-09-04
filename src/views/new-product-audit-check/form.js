// TODO form配置?

import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import {
  fetchGetTagList,
  fetchGetSuggestCategoryByProductName,
  fetchGetSuggestTagInfo
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/product'

const plugins = [
  createTagListPlugin({
    getTagList: fetchGetTagList,
    getSuggestList: fetchGetSuggestTagInfo
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