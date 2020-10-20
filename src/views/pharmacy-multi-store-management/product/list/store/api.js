import {
  multiStoreQueryList
  // fetchSubmitAsyncProductSequence,
  // fetchSubmitModProduct,
  // fetchSubmitDeleteProduct,
  // fetchSubmitModProductSku
} from '@/data/api/medicineMultiStore'

export default {
  product: {
    getList: multiStoreQueryList
    // delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    // modify: fetchSubmitModProduct,
    // modifySkuList: fetchSubmitModProductSku,
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
