import {
  // fetchGetProductDetail,
  fetchUniSaveSubmitEditProduct,
  fetchGetProductEditDetail,
  fetchGetNeedAudit,
  // fetchNormalSubmitEditProduct,
  fetchRevocationSubmitEditProduct,
  fetchGetUpcIsAuditProduct
} from '@/data/repos/product'
import {
  fetchGetSpInfoById,
  fetchGetSpInfoByUpc
} from '@/data/repos/standardProduct'
import { getOdinAuditNeedField } from '@/data/api/product'

export default {
  fetchGetUpcIsAuditProduct: fetchGetUpcIsAuditProduct,
  fetchGetSpInfoByUpc: fetchGetSpInfoByUpc,
  fetchProductDetail: fetchGetProductEditDetail,
  fetchSpInfoById: fetchGetSpInfoById,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchUniSaveSubmitEditProduct,
  fetchRevocationProduct: fetchRevocationSubmitEditProduct,
  getOdinAuditNeedField: getOdinAuditNeedField
}
