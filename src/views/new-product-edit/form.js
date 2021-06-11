import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createSpChangeInfoPlugin from '@/views/components/configurable-form/plugins/sp-change-info'
import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/correction-audit-field'
import createBrandProductModule from '@/views/components/configurable-form/plugins/brand-video/brand-video-plugin'

import {
  fetchGetTagList,
  fetchGetSuggestCategoryByProductName,
  fetchGetSuggestTagInfo
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/product'
import {
  fetchGetSpChangeInfoById
} from '@/data/repos/standardProduct'

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
  createPropertyLockPlugin(),
  createSpChangeInfoPlugin({ getChangeInfo: fetchGetSpChangeInfoById }),
  createBrandProductModule(),
  createProductCorrectionAuditTips()
]

export default createForm({ plugins })
