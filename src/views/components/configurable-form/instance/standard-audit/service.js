import {
  fetchGetMedicineCategoryAttrList
} from '@/data/repos/medicine'

export default {
  getContext: () => ({}),
  getCategoryAttrs: (id) => fetchGetMedicineCategoryAttrList(undefined, id, true)
}
