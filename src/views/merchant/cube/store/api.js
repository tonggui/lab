import { fetchGetProductNewArrivalTabList, fetchGetPoiScopeList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetMultiRecommendProductList,
  // fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitMultiCreateRecommendProduct
} from '@/data/repos/product'
import {
  getCubeBatchSaveProduct
} from '@/data/repos/merchantCube'

export default {
  multiCubeList: {
    tab: {
      getList: fetchGetProductNewArrivalTabList
    },
    tag: {
      getList: fetchGetNewArrivalTagList
    },
    product: {
      getList: fetchGetMultiRecommendProductList
    },
    scope: {
      getList: fetchGetPoiScopeList
    }
  },
  multiCubeEdit: {
    batchCreate: getCubeBatchSaveProduct,
    singleCreate: fetchSubmitMultiCreateRecommendProduct
  }
}
