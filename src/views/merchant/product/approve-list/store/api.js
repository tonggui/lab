import {
  fetchGetTagListByIncludeStatus
} from '@/data/repos/merchantCategory'
import {
  fetchGetIncludeProductList,
  fetchSubmitIncludeProduct,
  fetchDeleteApproveProduct
} from '@/data/repos/merchantProduct'
import {
  fetchGetAutoApproveStatus,
  fetchSubmitAutoApproveStatus
} from '@/data/repos/merchantPoi'

export default {
  tag: {
    getList: fetchGetTagListByIncludeStatus
  },
  product: {
    getList: fetchGetIncludeProductList,
    delete: fetchDeleteApproveProduct
  },
  include: fetchSubmitIncludeProduct,
  autoApprove: {
    get: fetchGetAutoApproveStatus,
    set: fetchSubmitAutoApproveStatus
  }
}
