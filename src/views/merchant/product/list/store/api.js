import {
  fetchGetSortedTagList,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag,
  fetchSubmitAsyncTagSequence,
  fetchSubmitUpdateTagSequence
} from '@/data/repos/merchantCategory'
import {
  fetchGetProductList,
  fetchSubmitUpdateProductSequence,
  fetchSubmitAsyncProductSequence,
  fetchSubmitModProduct,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku,
  fetchBatchModifyTag
} from '@/data/repos/merchantProduct'

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
    delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => {
      const products = Array.isArray(product) ? product : [product.id]
      fetchSubmitDeleteProduct(products, isMerchantDelete, isSelectAll, poiIdList)
    },
    modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku,
    asyncSequence: fetchSubmitAsyncProductSequence,
    batch: fetchBatchModifyTag
  }
}
