import httpClient from '../../client/instance/medicineMerchant'
import { CategoryAttr, TagWithSort } from '../../interface/category'
import { TAG_DELETE_TYPE } from '../../enums/category'

import { convertTag as convertTagToServer } from '../../helper/category/convertToServer'
import {
  convertCategoryAttrValueList as convertCategoryAttrValueListFromServer,
  convertTagList as convertTagListFromServer,
  convertTagWithSortList as convertTagWithSortListFromServer,
  convertCategoryList as convertCategoryListFromServer,
  convertCategoryListBySearch as convertCategoryListBySearchFromServer
} from '../../helper/category/convertFromServer'
import { Pagination } from '@/data/interface/common'

export const getTagList = () => httpClient.post('r/listTags').then(data => {
  const {
    tagList
  } = (data || {}) as any
  return convertTagListFromServer(tagList)
})

export const getSortedTagList = () => httpClient.post('r/listTags').then(data => {
  const {
    tagList,
    totalCount
  } = (data || {}) as any
  return {
    tagList: convertTagWithSortListFromServer(tagList),
    tagInfo: {
      productTotal: totalCount
    }
  }
})

/**
 * 一级分类调整为二级，二级分类调整为一级
 * tagId: 当前要操作的一级分类id, 或要操作的二级分类id,
 * parentId: 要调整为其二级的一级分类id, 或调整为一级分类时传0,
 */
export const submitChangeTagLevel = ({ tagId, parentId }: { tagId: number, parentId: number }) => httpClient.post('w/updateTagLevel', {
  id: tagId,
  parentId
})

/**
 * 新建 一级分类、二级分类
 */
export const submitAddTag = (tagInfo: TagWithSort) => httpClient.post('w/addTag', {
  ...convertTagToServer(tagInfo),
  id: 0
})

/**
 * 修改 一级分类、二级分类
 */
export const submitModTag = (tagInfo: TagWithSort) => httpClient.post('w/updateTag', {
  ...convertTagToServer(tagInfo),
  id: tagInfo.id
})

/**
 * 删除分类
 * @param: type: 操作类型：1-删除分类中的商品及二级分类；2-仅删除分类；
 * @param: tagId: 分类id；
 */
export const submitDeleteTag = ({ tagId, type }: { tagId: number, type: TAG_DELETE_TYPE }) => httpClient.post('w/deleteTag', {
  id: tagId,
  type
})

export const submitUpdateTagSequence = ({ tagId, parentId, sequence }) => httpClient.post('w/updateTagSequence', {
  tagId,
  parentTagId: parentId,
  sequence
})

export const submitAsyncTagSequence = ({ isSelectAll, poiIdList } : { isSelectAll: Boolean, poiIdList: Number[] }) => httpClient.post('w/syncTagSequence', {
  isUpdateAllPoi: isSelectAll,
  wmPoiIds: poiIdList
})

/**
 * 根据parentId获取后台分类
 * @param parentId
 */
export const getCategoryListByParentId = ({ parentId }: { parentId: number }) => httpClient.post('r/listCategoryByParentId', {
  parentId
}).then(data => convertCategoryListFromServer(data.categoryList || []))

/**
 * 级联类型的类目属性 根据parentId拉取数据
 * @param parentId 父id
 * @param attr 类目属性信息
 * @param pagination 分页信息
 */
export const getCategoryAttrListByParentId = ({ parentId, attr, pagination }: { parentId: number, attr: CategoryAttr, pagination: Pagination }) => {
  const { id, name } = attr
  return httpClient.post('r/attrValueCascade', {
    code: id,
    name,
    parentId
  }).then(data => {
    const { categoryAttrValueVos = [] } = data || {}
    return {
      data: convertCategoryAttrValueListFromServer(categoryAttrValueVos),
      pagination: {
        ...pagination,
        total: categoryAttrValueVos.length
      }
    }
  })
}

export const getTagListByFilter = (params) => httpClient.post('r/aggregationTagList', params)
  .then(data => {
    const {
      tagList,
      totalCount
    } = (data || {}) as any
    return {
      tagList: convertTagWithSortListFromServer(tagList),
      tagInfo: {
        productTotal: totalCount
      }
    }
  })

/**
 * 根据关键词搜索后台类目
 * @param keyword
 */
export const getCategoryByName = ({ keyword, poiId }: { keyword: string, poiId: number | string }) => httpClient.post('r/searchAllCategoryByName', {
  keyword,
  wmPoiId: poiId
}).then(data => {
  const list = data ? (data.leafCategoryList) : []
  const result = list.filter(v => v.isLeaf === 1)
  return convertCategoryListBySearchFromServer(result)
})