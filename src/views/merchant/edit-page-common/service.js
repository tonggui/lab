import {
  fetchGetProductDetail,
  fetchGetProductRevocation,
  fetchSaveOrUpdateProduct,
  fetchGetNeedAudit
} from '@/data/repos/merchantProduct'

export default {
  fetchProductDetail: fetchGetProductDetail,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchSaveOrUpdateProduct,
  fetchRevocationProduct: fetchGetProductRevocation
}
