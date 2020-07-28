import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
// import createSpChangeInfoHOC from '@/views/components/configurable-form/hoc/with-sp-change-info'
import {
  fetchGetTagList,
  fetchGetSuggestCategoryByProductName,
  fetchGetSuggestTagInfo
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/product'
// import {
//   fetchGetSpUpdateInfoById
// } from '@/data/repos/standardProduct'

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

const hoc = [
  // createSpChangeInfoHOC({
  //   getChangeInfo: fetchGetSpUpdateInfoById
  // })
]
export default createForm({ plugins, hoc })
