import {
  fetchGetProductInfoList
} from '@/data/repos/product'
import {
  fetchGetTagList
} from '@/data/repos/category'
import {
  fetchGetPoiAutoClearStockConfig,
  fetchSubmitPoiAutoClearStockConfig
} from '@/data/repos/poi'

export default {
  tag: {
    getList: fetchGetTagList
  },
  product: {
    getList: fetchGetProductInfoList
  },
  getConfig: fetchGetPoiAutoClearStockConfig,
  saveConfig: fetchSubmitPoiAutoClearStockConfig
}
