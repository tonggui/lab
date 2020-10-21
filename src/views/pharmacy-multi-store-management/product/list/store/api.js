import {
  multiStoreQueryList
// fetchSubmitAsyncProductSequence,
// fetchSubmitModProduct,
// fetchSubmitDeleteProduct,
// fetchSubmitModProductSku
} from '@/data/api/medicineMultiStore'
import { fetchSubmitModProductSku } from '@/data/repos/product'

export default {
  product: {
    getList: multiStoreQueryList,
    // delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    // modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku
    // asyncSequence: fetchSubmitAsyncProductSequence
  }
}
