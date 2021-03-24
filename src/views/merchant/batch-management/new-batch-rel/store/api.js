import {
  fetchGetSortedTagList
} from '@/data/repos/merchantCategory'
import {
  fetchGetProductListForNewBatchRel
} from '@/data/repos/merchantProduct'

export default {
  tag: {
    getList: fetchGetSortedTagList
  },
  product: {
    getList: fetchGetProductListForNewBatchRel
  }
}
