import {
  fetchGetSortedTagList
} from '@/data/repos/merchantCategory'
import {
  fetchGetProductList
} from '@/data/repos/merchantProduct'

export default {
  recommendList: {
    tag: {
      getList: fetchGetSortedTagList
    },
    product: {
      getList: fetchGetProductList
    }
  }
  // recommendEdit: {
  //   batchCreate: fetchSubmitBatchCreateRecommendProduct,
  //   singleCreate: fetchSubmitSingleCreateRecommendProduct
  // }
}
