import {
  fetchGetProductInfoList
} from '@/data/repos/product'
import {
  fetchGetTagList
} from '@/data/repos/category'
import { fetchGetTagList as fetchMerchantTagList } from '@/data/repos/merchantCategory'
import { fetchGetProductList } from '@/data/repos/merchantProduct'
import { getRuleRelProduct } from '@/data/api/setting'
import {
  fetchGetPoiAutoClearStockConfig,
  fetchSubmitPoiAutoClearStockConfig
} from '@/data/repos/poi'
import { isSingle } from '@/common/constants'
export default {
  tag: {
    getList: isSingle ? fetchGetTagList : fetchMerchantTagList
  },
  product: {
    getList: isSingle ? fetchGetProductInfoList : fetchGetProductList
  },
  getConfig: fetchGetPoiAutoClearStockConfig,
  saveConfig: fetchSubmitPoiAutoClearStockConfig,
  getRuleRelProduct: getRuleRelProduct
}
