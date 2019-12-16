import {
  fetchGetCategoryTemplateTaskStatus,
  fetchSubmitRetryCategoryTemplateApply,
  fetchSubmitApplyCategoryTemplate,
  fetchGetCategoryTemplatePreview,
  fetchGetCategoryTemplateList,
  fetchGetCategoryTemplateDetail,
  fetchGetCategoryTemplateProductList,
  fetchGetCategoryTemplateTaskInfo
} from '@/data/repos/category'

export default {
  init: fetchGetCategoryTemplateTaskInfo,
  polling: fetchGetCategoryTemplateTaskStatus,
  retry: fetchSubmitRetryCategoryTemplateApply,
  apply: fetchSubmitApplyCategoryTemplate,
  preview: fetchGetCategoryTemplatePreview,
  getOptions: fetchGetCategoryTemplateList,
  getDetail: fetchGetCategoryTemplateDetail,
  getProductList: fetchGetCategoryTemplateProductList
}
