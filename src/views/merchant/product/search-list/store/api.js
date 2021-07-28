import {
  fetchGetSortedTagList,
  fetchGetTagListBySearch
} from '@/data/repos/merchantCategory'
import {
  fetchGetProductListBySearch,
  fetchSubmitModProduct,
  fetchSubmitDeleteProduct,
  fetchSubmitModProductSku, fetchBatchModifyTag
} from '@/data/repos/merchantProduct'

export default {
  tag: {
    getFullTagList: fetchGetSortedTagList,
    getList: ({ keyword, brandId }) => fetchGetTagListBySearch(keyword, brandId)
  },
  product: {
    getList: fetchGetProductListBySearch,
    delete: (product, { isMerchantDelete, isSelectAll, poiIdList }) => {
      const products = Array.isArray(product) ? product : [product.id]
      fetchSubmitDeleteProduct(products, isMerchantDelete, isSelectAll, poiIdList)
    },
    modify: fetchSubmitModProduct,
    modifySkuList: fetchSubmitModProductSku,
    batch: fetchBatchModifyTag
  }
}
