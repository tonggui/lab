import {
  fetchGetCategoryAttrList
} from '@/data/repos/category'
import {
  fetchGetConfig
} from '@/data/repos/common'

export default {
  getContext: (categoryId) => fetchGetConfig(categoryId),
  getCategoryAttrs: fetchGetCategoryAttrList
}
