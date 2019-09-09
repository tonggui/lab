import {
  fetchGetProductInfoList,
  fetchSubmitDeleteProduct,
  fetchSubmitModProduct,
  fetchSubmitBatchOperationProduct,
  fetchSubmitModProductSku
} from '@/data/repos/product'

export default {
  getList: fetchGetProductInfoList,
  delete: fetchSubmitDeleteProduct,
  modify: fetchSubmitModProduct,
  batch: fetchSubmitBatchOperationProduct,
  modifySku: fetchSubmitModProductSku
}
