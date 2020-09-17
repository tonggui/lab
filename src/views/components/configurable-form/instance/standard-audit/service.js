import {
  fetchGetCombineMedicineCategoryAttrList
} from '@/data/repos/category'

export default {
  getContext: () => ({}),
  getCategoryAttrs: fetchGetCombineMedicineCategoryAttrList
}
