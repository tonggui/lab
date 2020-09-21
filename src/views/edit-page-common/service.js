import {
  // fetchGetProductDetail,
  fetchUniSaveSubmitEditProduct,
  fetchGetProductEditDetail,
  fetchGetNeedAudit,
  // fetchNormalSubmitEditProduct,
  fetchRevocationSubmitEditProduct
} from '@/data/repos/product'
import {
  fetchGetSpInfoById,
  fetchGetSpInfoByUpc
} from '@/data/repos/standardProduct'

export default {
  fetchGetSpInfoByUpc: fetchGetSpInfoByUpc,
  fetchProductDetail: fetchGetProductEditDetail,
  fetchSpInfoById: fetchGetSpInfoById,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchUniSaveSubmitEditProduct,
  fetchRevocationProduct: fetchRevocationSubmitEditProduct
}
