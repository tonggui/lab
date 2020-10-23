import {
  multiStoreQueryList
  // getCondition
// fetchSubmitAsyncProductSequence,
// fetchSubmitModProduct,
// fetchSubmitDeleteProduct,
// fetchSubmitModProductSku
} from '@/data/api/medicineMultiStore'
import { fetchSubmitModProductSku } from '@/data/repos/product'

export default {
  product: {
    getList: multiStoreQueryList,
    // getCondition,
    // delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    // modify: fetchSubmitModProduct,
    modifySku: fetchSubmitModProductSku
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
