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
  fetchGetListPageData
} from '@/data/repos/poi'

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
  fetchGetCategoryTemplateProductList
} from '@/data/repos/category'

export default {
  product: {
    getPageConfig: fetchGetListPageData,
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
