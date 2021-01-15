import {
  fetchGetCombineMedicineCategoryAttrList
} from '@/data/repos/category'
import {
  fetchGetConfig
} from '@/data/repos/medicineMerchantPoi'

export default {
  // 获取context
  getContext: (categoryId) => fetchGetConfig(categoryId),
  // 获取类目属性
  getCategoryAttrs: fetchGetCombineMedicineCategoryAttrList
}
