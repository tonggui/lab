import {
  fetchGetProductRelPoiListWithProduct,
  fetchSubmitClearRelPoi,
  fetchSubmitPoiProductSellStatus,
  fetchSubmitAddRelPoi
} from '@/data/repos/medicineMerchantProduct'
import {
  fetchGetPoiInfoListByIdList
} from '@/data/repos/poi'
import {
  fetchGetPoiList
} from '@/data/repos/merchantPoi'

export default {
  getList: fetchGetProductRelPoiListWithProduct,
  clearAssociated: fetchSubmitClearRelPoi,
  changeSellStatus: fetchSubmitPoiProductSellStatus,
  addPoi: fetchSubmitAddRelPoi,
  getPoiInfo: fetchGetPoiInfoListByIdList,
  getAllPoi: fetchGetPoiList
}
