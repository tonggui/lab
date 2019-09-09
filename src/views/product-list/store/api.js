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
  fetchSubmitUpdateTagSequence
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
    smartSort: fetchSubmitToggleTagToTop,
    dragSort: fetchSubmitUpdateTagSequence
  }
}
