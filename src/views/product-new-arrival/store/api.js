import { fetchGetProductNewArrivalTabList } from '@/data/repos/poi'
import { fetchGetNewArrivalTagList } from '@/data/repos/category'
import {
  fetchGetNewArrivalProductList,
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
    // batchCreate: fetchSubmitBatchCreateRecommendProduct,
    singleCreate: fetchSubmitSingleCreateNewArrivalProduct
  }
}
