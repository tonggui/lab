import {
  fetchGetProductDetail,
  fetchGetNeedAudit,
  fetchNormalSubmitEditProduct,
  fetchRevocationSubmitEditProduct
} from '@/data/repos/product'
import {
  fetchGetSpInfoById
} from '@/data/repos/standardProduct'

export default {
  fetchProductDetail: fetchGetProductDetail,
  fetchSpProductDetail: fetchGetSpInfoById,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchNormalSubmitEditProduct,
  fetchRevocationProduct: fetchRevocationSubmitEditProduct
}
