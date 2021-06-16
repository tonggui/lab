import { fetchGetProductNewArrivalTabList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetMultiRecommendProductList,
  fetchSubmitBatchCreateRecommendProduct,
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
      getList: fetchGetProductNewArrivalTabList
    }
  },
  multiCubeEdit: {
    batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitMultiCreateRecommendProduct
  }
}
