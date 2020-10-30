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
    delete: ({ wmPoiId, skuId }) => fetchSubmitDeleteProduct({ wmPoiId, skuIds: skuId }),
    modify: fetchSubmitModProduct,
    modifySku: fetchSubmitModProductSku
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
