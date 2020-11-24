import {
  getSuggestCategoryByProductName,
  getTagListByFilter,
  submitAddTag,
  submitChangeTagLevel,
  submitDeleteTag,
  submitUpdateTagSequence,
  getCategoryListByParentId,
  getWhiteListByCategory,
  getCategoryAttrListByParentId
} from '../merchantApi/category'
import { CategoryAttr, Tag } from '../interface/category'

import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'
import { Pagination } from '@/data/interface/common'

export {
  getSortedTagList as fetchGetSortedTagList,
  getTagList as fetchGetTagList,
  submitAsyncTagSequence as fetchSubmitAsyncTagSequence
} from '../merchantApi/category'

/* Akita wrapper start */
const akitaWrappedSubmitAddTag = wrapAkitaBusiness(
  (tagInfo) => {
    const type = tagInfo.id ? TYPE.UPDATE : TYPE.CREATE
    return [MODULE.MERCHANT_TAG, type, true]
  }
)(submitAddTag)
const akitaWrappedSubmitDeleteTag = wrapAkitaBusiness(
  (params) => {
    const type = params.type === 1 ? TYPE.DELETE_WITH : TYPE.DELETE
    return [MODULE.MERCHANT_TAG, type, true]
  }
)(submitDeleteTag)
/* Akita wrapper end */

export const fetchSubmitChangeTagLevel = (tagId: number, parentId: number) => submitChangeTagLevel({ tagId, parentId })

export const fetchSubmitDeleteTag = (tagId: number, type) => akitaWrappedSubmitDeleteTag({ tagId, type })

export const fetchSubmitAddTag = akitaWrappedSubmitAddTag

export const fetchSubmitModTag = tagInfo => fetchSubmitAddTag(tagInfo)

export const fetchGetTagListBySearch = (keyword: string, brandId: number) => getTagListByFilter({
  keyWords: keyword,
  includeStatus: 1,
  brandId: brandId || 0
})

export const fetchGetTagListByIncludeStatus = ({ keyword }: { keyword: string }) => getTagListByFilter({
  keyWords: keyword,
  includeStatus: 2
})

export const fetchSubmitUpdateTagSequence = (tag: Tag, sequence: number) => submitUpdateTagSequence({ tagId: tag.id, parentId: tag.parentId, sequence })

export const fetchGetSuggestCategoryByProductName = (name: string, spuId: string | number) => getSuggestCategoryByProductName({ name, spuId })

const categoryCache = {}
export const fetchGetCategoryListByParentId = (parentId: number) => {
  if (categoryCache[parentId]) {
    return Promise.resolve(categoryCache[parentId])
  }
  return getCategoryListByParentId({ parentId: parentId || 0 }).then(data => {
    categoryCache[parentId] = data
    return data
  })
}

export const fetchGetWhiteListModuleMapByCategoryId = (categoryId: number) => getWhiteListByCategory({ categoryId })

export const fetchGetCategoryAttrListByParentId = (parentId: number, attr: CategoryAttr, pagination: Pagination) => getCategoryAttrListByParentId({ parentId, attr, pagination })
