// TODO 插件传入?
import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
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
  createSuggestTagListPlugin({
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