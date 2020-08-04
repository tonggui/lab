// TODO 插件传入?
import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createProductAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips'
import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/correction-audit-field-tips'
import { fetchGetTagList } from '@/data/repos/merchantCategory'
import {
  fetchGetSuggestCategoryByProductName
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/merchantProduct'

const plugins = [
  createSuggestTagListPlugin({
    getTagList: fetchGetTagList
  }),
  createCategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createSuggestCategoryPlugin({
    getCategoryAppealInfo: fetchGetCategoryAppealInfo,
    getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName
  }),
  createPropertyLockPlugin(),
  createProductAuditTips(),
  createProductCorrectionAuditTips()
]

export default createForm({ plugins })
