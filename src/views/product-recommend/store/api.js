import { fetchGetRecommendTagList } from '@/data/repos/category'
import { fetchGetRecommendProductList } from '@/data/repos/product'

export default {
  tag: {
    getList: fetchGetRecommendTagList
  },
  product: {
    getList: fetchGetRecommendProductList
  }
}
