import {
  fetchGetSortedTagList,
  fetchGetTagListBySearch
} from '@/data/repos/merchantCategory'
import {
  fetchGetProductListBySearch,
  fetchSubmitModProduct,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku
} from '@/data/repos/merchantProduct'

export default {
  tag: {
    getFullTagList: fetchGetSortedTagList,
    getList: ({ keyword, brandId }) => fetchGetTagListBySearch(keyword, brandId)
  },
  product: {
    getList: fetchGetProductListBySearch,
    delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => fetchSubmitDeleteProduct([product.id], isMerchantDelete, isSelectAll, poiIdList),
    modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku
  }
}
