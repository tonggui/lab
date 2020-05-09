import {
  fetchGetCellularNewProductList,
  fetchGetCellularExistProductList,
  fetchGetCellularProductStatistics,
  fetchSubmitCellularProductPuton
} from '@/data/repos/product'
import {
  fetchGetCellularProductTaskInfo
} from '@/data/repos/poi'
import {
  fetchGetTagList
} from '@/data/repos/category'
import { TAB } from '../constants'

export default {
  getTaskInfo: fetchGetCellularProductTaskInfo,
  getTabList: fetchGetCellularProductStatistics,
  getTagList: fetchGetTagList,
  [TAB.NEW]: {
    getList: fetchGetCellularNewProductList,
    putOn: fetchSubmitCellularProductPuton
  },
  [TAB.EXIST]: {
    getList: fetchGetCellularExistProductList,
    putOn: fetchSubmitCellularProductPuton
  }
}
