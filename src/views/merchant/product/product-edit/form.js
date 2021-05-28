import createForm from '@/views/merchant/edit-page-common/form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/checkbox-tag-list'
// import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createProductCorrectionAuditTips
  from '@/views/components/configurable-form/plugins/audit-field-tips/correction-audit-field'

import { fetchGetSuggestCategoryByProductName, fetchGetTagList } from '@/data/repos/merchantCategory'
import { fetchGetCategoryAppealInfo } from '@/data/repos/merchantProduct'
// import { fetchGetSuggestTagInfo } from '@/data/repos/category'

const plugins = [
  createTagListPlugin({
    getTagList: fetchGetTagList
  }),
  // createSuggestTagListPlugin({
  //   getTagList: fetchGetTagList,
  //   getSuggestList: fetchGetSuggestTagInfo
  // }),
  createCategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  }),
  createPropertyLockPlugin(),
  createProductCorrectionAuditTips()
]
export default createForm({ plugins })
