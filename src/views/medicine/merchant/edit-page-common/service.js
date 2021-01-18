import {
  fetchGetProductDetail, // 医药商家商品中心获取商品详情接口
  fetchSaveOrUpdateProduct // 医药商家商品中心商品保存或更新接口
} from '@/data/repos/medicineMerchantProduct'

import {
  fetchGetSpInfoByUpc
} from '@/data/repos/standardProduct'

export default {
  fetchGetSpInfoByUpc: fetchGetSpInfoByUpc,
  fetchProductDetail: fetchGetProductDetail,
  fetchSubmitProduct: fetchSaveOrUpdateProduct
}
