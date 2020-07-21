import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import CategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'

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
  CategorySelectSpPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  })
]

export default createForm({ plugins })
