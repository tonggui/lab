import {
  fetchGetProductDetail, // 商家商品中心获取详情接口
  fetchGetProductRevocation, // 商家商品中心撤回接口
  fetchSaveOrUpdateProduct, // 商家商品中心保存或更新接口
  fetchGetNeedAudit // 商家商品中心审核权限获取接口
} from '@/data/repos/merchantProduct'

import {
  fetchGetSpInfoByUpc
} from '@/data/repos/standardProduct'

export default {
  fetchGetSpInfoByUpc: fetchGetSpInfoByUpc,
  fetchProductDetail: fetchGetProductDetail,
  fetchNeedAudit: fetchGetNeedAudit,
  fetchSubmitProduct: fetchSaveOrUpdateProduct,
  fetchRevocationProduct: fetchGetProductRevocation
}
