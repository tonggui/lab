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

export const fetchSubmitModTag = tagInfo => fetchSubmitAddTag(tagInfo)