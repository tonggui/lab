import { fetchGetRecommendTagList } from '@/data/repos/category'
import {
  fetchGetRecommendProductList,
  fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitSingleCreateRecommendProduct
} from '@/data/repos/product'

export default {
  recommendList: {
    tag: {
      getList: fetchGetRecommendTagList
    },
    product: {
      getList: fetchGetRecommendProductList
    }
  },
  recommendEdit: {
    batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitSingleCreateRecommendProduct
  }
}
