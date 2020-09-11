import {
  // fetchGetProductDetail,
  fetchUniSaveSubmitEditProduct,
  fetchGetProductEditDetail,
  fetchGetNeedAudit,
  // fetchNormalSubmitEditProduct,
  fetchRevocationSubmitEditProduct
} from '@/data/repos/product'
import {
  fetchGetSpInfoById
} from '@/data/repos/standardProduct'

export default {
  fetchProductDetail: fetchGetProductEditDetail,
  fetchSpInfoById: fetchGetSpInfoById,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchUniSaveSubmitEditProduct,
  fetchRevocationProduct: fetchRevocationSubmitEditProduct
}
