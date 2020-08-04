// TODO form配置?

import createForm from '@/views/components/configurable-form/instance/common-form'
import createTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
import createSelectProductFromLibraryPlugin from '@/views/components/configurable-form/plugins/product-library'
import createProductAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips'
import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/correction-audit-field-tips'
import {
  fetchGetTagList
} from '@/data/repos/merchantCategory'

const plugins = [
  createTagListPlugin({
    getTagList: fetchGetTagList
  }),
  createCategorySelectSpPlugin(),
  createSelectProductFromLibraryPlugin(),
  createPropertyLockPlugin(),
  createProductAuditTips(),
  createProductCorrectionAuditTips()
]
export default createForm({ plugins })
