import { fetchGetProductNewArrivalTabList } from '@/data/repos/poi'
import { fetchGetRecommendTagList } from '@/data/repos/category'
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
      getList: fetchGetRecommendTagList
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
