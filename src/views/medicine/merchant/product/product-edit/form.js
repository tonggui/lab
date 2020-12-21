import createForm from '@/views/medicine//merchant/edit-page-common/form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createProductCorrectionAuditTips
  from '@/views/components/configurable-form/plugins/audit-field-tips/correction-audit-field'

import { fetchGetTagList } from '@/data/repos/medicineMerchantCategory'

const plugins = [
  createTagListPlugin({
    getTagList: fetchGetTagList
  }),
  createCategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createPropertyLockPlugin(),
  createProductCorrectionAuditTips()
]
export default createForm({ plugins })
