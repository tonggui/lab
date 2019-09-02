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

export default {
  getList: fetchGetProductInfoList,
  getSortList: fetchGetProductListOnSorting,
  changeSortType: fetchSubmitChangeProductSortType,
  delete: fetchSubmitDeleteProduct,
  modify: fetchSubmitModProduct,
  batch: fetchSubmitBatchOperationProduct,
  smartSort: fetchSubmitToggleProductToTop,
  dragSort: fetchSubmitUpdateProductSequence,
  modifySku: fetchSubmitModProductSku
}
