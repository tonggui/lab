import {
  submitChangeTagLevel,
  submitAddTag,
  submitModTag,
  submitDeleteTag,
  submitUpdateTagSequence,
  getCategoryListByParentId,
  getCategoryAttrListByParentId
} from '../medicineMerchantApi/category'

import { CategoryAttr, Tag } from '../interface/category'
import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'
import { Pagination } from '@/data/interface/common'

export {
  getSortedTagList as fetchGetSortedTagList,
  getTagList as fetchGetTagList,
  submitAsyncTagSequence as fetchSubmitAsyncTagSequence
} from '../medicineMerchantApi/category'

/* Akita wrapper start */
const akitaWrappedSubmitAddTag = wrapAkitaBusiness(
  () => {
    const type = TYPE.CREATE
    return [MODULE.MERCHANT_TAG, type, true]
  }
)(submitAddTag)

const akitaWrappedSubmitModTag = wrapAkitaBusiness(
  () => {
    const type = TYPE.UPDATE
    return [MODULE.MERCHANT_TAG, type, true]
  }
)(submitModTag)

const akitaWrappedSubmitDeleteTag = wrapAkitaBusiness(
  (params) => {
    const type = params.type === 1 ? TYPE.DELETE_WITH : TYPE.DELETE
    return [MODULE.MERCHANT_TAG, type, true]
  }
)(submitDeleteTag)
/* Akita wrapper end */

export const fetchSubmitChangeTagLevel = (tagId: number, parentId: number) => submitChangeTagLevel({ tagId, parentId })

export const fetchSubmitAddTag = akitaWrappedSubmitAddTag

export const fetchSubmitModTag = akitaWrappedSubmitModTag

export const fetchSubmitDeleteTag = (tagId: number, type) => akitaWrappedSubmitDeleteTag({ tagId, type })

export const fetchSubmitUpdateTagSequence = (tag: Tag, sequence: number) => submitUpdateTagSequence({ tagId: tag.id, parentId: tag.parentId, sequence })

// 查询商品类目
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


export const fetchGetCategoryAttrListByParentId = (parentId: number, attr: CategoryAttr, pagination: Pagination) => getCategoryAttrListByParentId({ parentId, attr, pagination })