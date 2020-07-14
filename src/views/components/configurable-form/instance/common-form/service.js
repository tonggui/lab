import {
  fetchGetCategoryAttrList,
  fetchGetTagList,
  fetchGetSuggestCategoryByProductName,
  fetchGetSuggestTagInfo
} from '@/data/repos/category'
import {
  fetchGetProductDetail,
  fetchGetCategoryAppealInfo
} from '@/data/repos/product'
import fetchContext from './asyncContextData' // TODO

export default {
  getProductDetail: (id, poiId) => fetchGetProductDetail(id, poiId, false),
  getTagList: () => fetchGetTagList(),
  getContext: () => fetchContext(),
  getCategoryAppealInfo: fetchGetCategoryAppealInfo,
  getSuggestCategoryByProductName: fetchGetSuggestCategoryByProductName,
  getSuggestTagList: fetchGetSuggestTagInfo,
  getCategoryAttrs: fetchGetCategoryAttrList
}
