import {
  fetchGetCombineMedicineCategoryAttrList
} from '@/data/repos/category'
import {
  fetchGetConfig
} from '@/data/repos/common'

export default {
  // 获取context
  getContext: (categoryId) => fetchGetConfig(categoryId),
  // 获取类目属性
  getCategoryAttrs: fetchGetCombineMedicineCategoryAttrList
}
