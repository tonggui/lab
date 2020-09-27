import { fetchGetRecommendTagList } from '@/data/repos/category'
import {
  fetchGetRecommendProductList,
  fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitSingleCreateRecommendProduct
} from '@/data/repos/product'

export default {
  newArrivalList: {
    tag: {
      getList: fetchGetRecommendTagList
    },
    product: {
      getList: fetchGetRecommendProductList
    }
  },
  newArrivalEdit: {
    batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitSingleCreateRecommendProduct
  }
}
