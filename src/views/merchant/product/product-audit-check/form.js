import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSuggestCategoryPlugin from '@/views/components/configurable-form/plugins/suggest-category'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createProductAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/re-audit-field'
import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/correction-audit-field'
import {
  fetchGetTagList
} from '@/data/repos/merchantCategory'
import {
  fetchGetSuggestCategoryByProductName
} from '@/data/repos/category'
import {
  fetchGetCategoryAppealInfo
} from '@/data/repos/merchantProduct'

export default () => {
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
    createPropertyLockPlugin(),
    createProductAuditTips(),
    createProductCorrectionAuditTips()
  ]
  createForm({ plugins })
}
