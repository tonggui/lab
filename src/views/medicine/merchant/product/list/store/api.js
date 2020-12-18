import {
  fetchGetSortedTagList,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag,
  fetchSubmitAsyncTagSequence,
  fetchSubmitUpdateTagSequence
} from '@/data/repos/medicineMerchantCategory'
import {
  fetchGetProductList,
  fetchSubmitUpdateProductSequence,
  fetchSubmitAsyncProductSequence,
  fetchSubmitModProduct,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku
} from '@/data/repos/medicineMerchantProduct'

export default {
  tag: {
    getList: fetchGetSortedTagList,
    changeLevel: fetchSubmitChangeTagLevel,
    modify: fetchSubmitModTag,
    add: fetchSubmitAddTag,
    delete: fetchSubmitDeleteTag,
    dragSort: ({ tag, sequence }) => fetchSubmitUpdateTagSequence(tag, sequence),
    asyncSequence: fetchSubmitAsyncTagSequence
  },
  product: {
    getList: fetchGetProductList,
    getSortList: fetchGetProductList,
    dragSort: fetchSubmitUpdateProductSequence,
    delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku,
    asyncSequence: fetchSubmitAsyncProductSequence
  }
}
