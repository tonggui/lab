import {
  submitChangeTagLevel,
  submitAddTag,
  submitModTag,
  submitDeleteTag,
  submitUpdateTagSequence
} from '../medicineMerchantApi/category'

import { Tag } from '../interface/category'
import { wrapAkitaBusiness } from '@/common/akita/index'
import { BUSINESS_MODULE as MODULE, MODULE_SUB_TYPE as TYPE } from '@/common/akita/business_indexes'

export {
  getSortedTagList as fetchGetSortedTagList,
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