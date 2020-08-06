// TODO 运营端表单配置?
import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
import createManagerCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/manager-audit-field'
import {
  fetchGetTagList
} from '@/data/repos/merchantCategory'

export default () => {
  const plugins = [
    createSuggestTagListPlugin({
      getTagList: fetchGetTagList
    }),
    createManagerCorrectionAuditTips()
  ]
  return createForm({ plugins })
}
