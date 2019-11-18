import {
  CategoryAttr,
  Tag,
  CategoryTemplate,
  BaseCategoryTemplate
} from '../interface/category'
import {
  Pagination
} from '../interface/common'
import {
  TAG_DELETE_TYPE
} from '../enums/category'

import {
  getPoiTagInfo,
  getTagList,
  submitUpdateTagSequence,
  submitToggleTagToTop,
  submitToggleTagSmartSort,
  submitDeleteTag,
  submitDeleteTagAndProduct,
  submitChangeTagLevel,
  getCategoryListByParentId,
  getCategoryByName,
  getCategoryAttrSwitch,
  getCategoryAttrList,
  getCategoryAttrListByName,
  getCategoryAttrListByParentId,
  submitAddTag,
  getCategoryTemplateList,
  getCategoryTemplateDetail,
  getCategoryTemplatePreview,
  submitApplyCategoryTemplate,
  getCategoryTemplateProductList,
  submitRetryCategoryTemplateApply,
  getCategoryTemplateTaskStatus,
  getHotCategory,
  getWhiteListByCategory
} from '../api/category'

const categoryCache = {}

export const fetchGetPoiTagInfo = (needSmartSort: boolean, poiId: number) => getPoiTagInfo({ needSmartSort, poiId })

export const fetchGetTagList = (poiId: number) => getTagList({ poiId })

export const fetchSubmitUpdateTagSequence = (tagIdList: number[], poiId: number) => submitUpdateTagSequence({ tagIdList, poiId })

export const fetchSubmitToggleTagToTop = (tagId: number, isSmartSort: boolean, sequence: number, poiId: number) => submitToggleTagToTop({ poiId, isSmartSort, tagId, sequence })

export const fetchSubmitAddTag = (tagInfo: Tag, poiId: number) => submitAddTag({ tagInfo, poiId })

export const fetchSubmitModTag = (tagInfo: Tag, poiId: number) => {
  return fetchSubmitAddTag(tagInfo, poiId)
}

export const fetchSubmitToggleTagSmartSort = (status: boolean, poiId: number) => submitToggleTagSmartSort({ poiId, status })

export const fetchSubmitDeleteTag = (tagId: number, type: TAG_DELETE_TYPE | undefined,  poiId: number) => {
  if (type === undefined) {
    return submitDeleteTag({ poiId, tagId })
  }
  return fetchSubmitDeleteTagAndProduct(tagId, type, poiId)
}

export const fetchSubmitDeleteTagAndProduct = (tagId: number, type: TAG_DELETE_TYPE, poiId: number) => submitDeleteTagAndProduct({ poiId, type, tagId })

export const fetchSubmitChangeTagLevel = (tagId: number, parentId: number | string, poiId: number) => submitChangeTagLevel({ poiId, tagId, parentId })

export const fetchGetCategoryListByParentId = (parentId: number, poiId: number | string) => {
  if (categoryCache[parentId]) {
    return Promise.resolve(categoryCache[parentId])
  }
  return getCategoryListByParentId({ parentId: parentId || 0, poiId }).then(data => {
    categoryCache[parentId] = data
    return data
  })
}

export const fetchGetCategoryByName = (keyword: string, poiId: number | string) => getCategoryByName({ keyword, poiId })

export const fetchGetCategoryAttrSwitch = (poiIdList: number | number[]) => getCategoryAttrSwitch({
  poiIdList: ([] as number[]).concat(poiIdList)
})

export const fetchGetCategoryAttrList = async (categoryId: number) => getCategoryAttrList({ categoryId })

export const fetchGetCategoryAttrListByName = (attr: CategoryAttr, filter: { keyword: string, pagination?: Pagination }) => getCategoryAttrListByName({ attr, filter })

export const fetchGetCategoryAttrListByParentId = (parentId: number, attr: CategoryAttr, pagination: Pagination) => getCategoryAttrListByParentId({ parentId, attr, pagination })

export const fetchGetCategoryTemplateList = (poiId: number) => getCategoryTemplateList({ poiId })

export const fetchGetCategoryTemplateDetail = (template: BaseCategoryTemplate, poiId: number) => getCategoryTemplateDetail({ poiId, template })

export const fetchGetCategoryTemplatePreview = (template: CategoryTemplate, poiId: number) => getCategoryTemplatePreview({ poiId, template })

export const fetchSubmitApplyCategoryTemplate = (template: CategoryTemplate, poiId: number) => submitApplyCategoryTemplate({ poiId, template })

export const fetchGetCategoryTemplateProductList = ({ currentTag, templateType, status }, pagination: Pagination, statusList, poiId: number) => getCategoryTemplateProductList({
  poiId,
  pagination,
  currentTag,
  templateType,
  status,
  statusList
})

export const fetchSubmitRetryCategoryTemplateApply = (poiId) => submitRetryCategoryTemplateApply({ poiId })

export const fetchGetCategoryTemplateTaskStatus = (taskId) => getCategoryTemplateTaskStatus({ taskId })

export const fetchGetHotCategory = (poiId) => getHotCategory({ poiId })

export const fetchGetWhiteListModuleMapByCategoryId = (categoryId: number, poiId?: number) => getWhiteListByCategory({ poiId, categoryId })
