import {
  TAG_OPERATION_TYPE
} from '../enums/category'
export {
  getSortedTagList as fetchGetSortedTagList,
  getTagList as fetchGetTagList
} from '../merchantApi/category'
import {
  submitChangeTagLevel,
  submitDeleteTag,
  submitAddTag
} from '../merchantApi/category'

export const fetchSubmitChangeTagLevel = (tagId: number, parentId: number) => submitChangeTagLevel({ tagId, parentId })

export const fetchSubmitDeleteTag = (tagId: number, type) => submitDeleteTag({ tagId, type })

export const fetchSubmitAddTag = submitAddTag

export const fetchSubmitModTag = (tagInfo, type: TAG_OPERATION_TYPE) => {
  if ([TAG_OPERATION_TYPE.SET_CHILD_TAG, TAG_OPERATION_TYPE.SET_FIRST_TAG].includes(type)) {
    return fetchSubmitChangeTagLevel(tagInfo.id as number, tagInfo.parentId)
  }
  return fetchSubmitAddTag(tagInfo)
}
