// TODO 运营端表单配置?
import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/suggest-tag-list'
import { buildCategoryAttrsContainer } from '@/views/components/configurable-form/components/category-attrs'
import createManagerCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/manager-audit-field'
import {
  fetchGetTagList,
  fetchGetSuggestTagInfo
} from '@/data/repos/category'

const plugins = [
  createSuggestTagListPlugin({
    getTagList: fetchGetTagList,
    getSuggestList: fetchGetSuggestTagInfo
  }),
  createManagerCorrectionAuditTips()
]

export default createForm({
  plugins,
  components: {
    CategoryAttrs: buildCategoryAttrsContainer({
      fieldConfig: {
        rules: [{
          result: {
            required () { return false }
          }
        }]
      }
    })
  }
})
