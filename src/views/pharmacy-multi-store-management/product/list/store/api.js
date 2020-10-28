import {
  multiStoreQueryList,
  fetchSubmitDeleteProduct
  // fetchSubmitModProduct
  // getCondition
// fetchSubmitAsyncProductSequence,
// fetchSubmitModProduct,
// fetchSubmitDeleteProduct,
// fetchSubmitModProductSku
} from '@/data/api/medicineMultiStore'
import {
  fetchSubmitModProductSku
  // fetchSubmitDeleteProduct,
  // fetchSubmitModProduct
} from '@/data/repos/product'

export default {
  product: {
    getList: multiStoreQueryList,
    // getCondition,
    delete: ({ wmPoiId, skuId }) => fetchSubmitDeleteProduct({ wmPoiId, skuIds: skuId }),
    // modify: fetchSubmitModProduct,
    modifySku: fetchSubmitModProductSku
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
