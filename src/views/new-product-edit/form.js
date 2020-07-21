import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
// import SuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import {
  fetchGetTagList,
  fetchGetSuggestCategoryByProductName
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/product'

const plugins = [
  createTagListPlugin({
    getTagList: () => fetchGetTagList()
  }),
  createCategorySelectSpPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  })
]

export default createForm({ plugins })
