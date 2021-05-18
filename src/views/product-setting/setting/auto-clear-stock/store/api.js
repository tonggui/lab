import {
  fetchGetProductInfoList
} from '@/data/repos/product'
import {
  fetchGetTagList
} from '@/data/repos/category'
import { fetchGetTagList as fetchMerchantTagList } from '@/data/repos/merchantCategory'
import { fetchGetProductList } from '@/data/repos/merchantProduct'
import {
  fetchGetPoiAutoClearStockConfig,
  fetchSubmitPoiAutoClearStockConfig
} from '@/data/repos/poi'
import { getIsSingle } from '@/common/constants'
export default {
  tag: {
    getList: getIsSingle() ? fetchGetTagList : fetchMerchantTagList
  },
  product: {
    getList: getIsSingle() ? fetchGetProductInfoList : fetchGetProductList
  },
  getConfig: fetchGetPoiAutoClearStockConfig,
  saveConfig: fetchSubmitPoiAutoClearStockConfig
}
