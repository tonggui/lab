import { fetchGetProductNewArrivalTabList, fetchGetPoiScopeList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetMultiRecommendProductList,
  // fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitMultiCreateRecommendProduct
} from '@/data/repos/product'

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
    // batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitMultiCreateRecommendProduct
  }
}
