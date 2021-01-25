import {
  multiStoreQueryList,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku,
  fetchSubmitModProduct
} from '@/data/api/medicineMultiStore'

export default {
  product: {
    getList: multiStoreQueryList,
    delete: fetchSubmitDeleteProduct,
    modify: fetchSubmitModProduct,
    modifySku: fetchSubmitModProductSku
  }
}
