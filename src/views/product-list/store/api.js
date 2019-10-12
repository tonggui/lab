import {
  fetchGetProductInfoList,
  fetchGetProductListOnSorting,
  fetchSubmitChangeProductSortType,
  fetchSubmitDeleteProduct,
  fetchSubmitModProduct,
  fetchSubmitBatchOperationProduct,
  fetchSubmitToggleProductToTop,
  fetchSubmitUpdateProductSequence,
  fetchSubmitModProductSku
} from '@/data/repos/product'

import {
  fetchGetPoiTagInfo,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag,
  fetchSubmitToggleTagToTop,
  fetchSubmitUpdateTagSequence,
  fetchGetCategoryTemplateTaskStatus,
  fetchSubmitRetryCategoryTemplateApply,
  fetchSubmitApplyCategoryTemplate,
  fetchGetCategoryTemplatePreview,
  fetchGetCategoryTemplateList,
  fetchGetCategoryTemplateDetail,
  fetchGetCategoryTemplateProductList,
  fetchSubmitToggleTagSmartSort
} from '@/data/repos/category'

export default {
  product: {
    getList: fetchGetProductInfoList,
    getSortList: fetchGetProductListOnSorting,
    changeSortType: fetchSubmitChangeProductSortType,
    delete: fetchSubmitDeleteProduct,
    modify: fetchSubmitModProduct,
    batch: fetchSubmitBatchOperationProduct,
    smartSort: fetchSubmitToggleProductToTop,
    dragSort: fetchSubmitUpdateProductSequence,
    modifySku: fetchSubmitModProductSku
  },
  tag: {
    getList: fetchGetPoiTagInfo,
    changeLevel: fetchSubmitChangeTagLevel,
    modify: fetchSubmitModTag,
    add: fetchSubmitAddTag,
    delete: fetchSubmitDeleteTag,
    changeSortType: fetchSubmitToggleTagSmartSort,
    smartSort: fetchSubmitToggleTagToTop,
    dragSort: fetchSubmitUpdateTagSequence
  },
  template: {
    polling: fetchGetCategoryTemplateTaskStatus,
    retry: fetchSubmitRetryCategoryTemplateApply,
    apply: fetchSubmitApplyCategoryTemplate,
    preview: fetchGetCategoryTemplatePreview,
    getOptions: fetchGetCategoryTemplateList,
    getDetail: fetchGetCategoryTemplateDetail,
    getProductList: fetchGetCategoryTemplateProductList
  }
}
