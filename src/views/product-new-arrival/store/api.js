import { fetchGetProductNewArrivalTabList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetNewArrivalProductList,
  fetchSubmitBatchCreateRecommendProduct,
  fetchSubmitSingleCreateNewArrivalProduct
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
    singleCreate: fetchSubmitSingleCreateNewArrivalProduct
  }
}
