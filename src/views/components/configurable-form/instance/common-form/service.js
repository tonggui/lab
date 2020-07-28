import {
  fetchGetCategoryAttrList
} from '@/data/repos/category'
import fetchContext from './asyncContextData' // TODO

export default {
  getContext: (id) => fetchContext(id),
  getCategoryAttrs: fetchGetCategoryAttrList
}
