import {
  multiStoreQueryList,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku,
  fetchSubmitModProduct
  // getCondition
// fetchSubmitAsyncProductSequence,
// fetchSubmitModProduct,
// fetchSubmitDeleteProduct,
// fetchSubmitModProductSku
} from '@/data/api/medicineMultiStore'

export default {
  product: {
    getList: multiStoreQueryList,
    // getCondition,
    delete: fetchSubmitDeleteProduct,
    modify: fetchSubmitModProduct,
    modifySku: fetchSubmitModProductSku
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
