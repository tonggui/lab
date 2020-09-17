// TODO 运营端表单配置?
import createForm from '@/views/merchant/edit-page-common/form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createManagerCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/manager-audit-field'
import {
  fetchGetTagList
} from '@/data/repos/merchantCategory'

const plugins = [
  createSuggestTagListPlugin({
    getTagList: fetchGetTagList
  }),
  createManagerCorrectionAuditTips()
]
export default createForm({ plugins })
