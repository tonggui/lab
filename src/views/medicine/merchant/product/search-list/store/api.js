import {
  fetchGetTagListBySearch
} from '@/data/repos/medicineMerchantCategory'
import {
  fetchGetProductListBySearch,
  fetchSubmitModProduct,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku
} from '@/data/repos/medicineMerchantProduct'

export default {
  tag: {
    getList: fetchGetTagListBySearch
  },
  product: {
    getList: fetchGetProductListBySearch,
    delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku
  }
}
