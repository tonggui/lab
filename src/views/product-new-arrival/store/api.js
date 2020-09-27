import { fetchGetProductNewArrivalTabList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetNewArrivalProductList,
  fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitSingleCreateRecommendProduct
} from '@/data/repos/product'

export default {
  newArrivalList: {
    tab: {
      getList: fetchGetProductNewArrivalTabList
    },
    tag: {
      getList: fetchGetNewArrivalTagList
    },
    product: {
      getList: fetchGetNewArrivalProductList
    }
  },
  newArrivalEdit: {
    batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitSingleCreateRecommendProduct
  }
}
