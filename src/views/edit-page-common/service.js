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
  fetchSpInfoById: fetchGetSpInfoById,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchNormalSubmitEditProduct,
  fetchRevocationProduct: fetchRevocationSubmitEditProduct
}
