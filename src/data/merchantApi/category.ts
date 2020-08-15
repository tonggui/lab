import httpClient from '../client/instance/merchant'
import { CategoryAttr, TagWithSort } from '../interface/category'
import { TAG_DELETE_TYPE } from '../enums/category'
import {
  convertCategoryAttrValueList as convertCategoryAttrValueListFromServer,
  convertCategoryBySearch, convertCategoryList as convertCategoryListFromServer,
  convertTagList as convertTagListFromServer,
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer'
import { convertTag as convertTagToServer } from '../helper/category/convertToServer'
import { convertWhiteListModuleMap as convertWhiteListModuleMapFromServer } from '@/data/helper/common/convertFromServer'
import { Pagination } from '@/data/interface/common'

export const getTagList = () => httpClient.post('hqcc/r/tagList').then(data => {
  const {
    tagList
  } = (data || {}) as any
  return convertTagListFromServer(tagList)
})

export const getTagListByFilter = (params) => httpClient.post('hqcc/r/aggregationTagList', params)
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

export const getSortedTagList = () => httpClient.post('hqcc/r/tagList').then(data => {
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
 * 新建、修改一级分类、二级分类
 */
export const submitAddTag = (tagInfo: TagWithSort) => httpClient.post('hqcc/w/saveTag', {
  ...convertTagToServer(tagInfo),
  id: tagInfo.id || 0
})

/**
 * 一级分类调整为二级，二级分类调整为一级
 * tagId: 当前要操作的一级分类id, 或要操作的二级分类id,
 * parentId: 要调整为其二级的一级分类id, 或调整为一级分类时传0,
 */
export const submitChangeTagLevel = ({ tagId, parentId }: { tagId: number, parentId: number }) => httpClient.post('hqcc/w/changeTagLevel', {
  id: tagId,
  parentId
})

/**
 * 删除分类
 * @param: type: 操作类型：1-删除分类中的商品及二级分类；2-仅删除分类；
 * @param: tagId: 分类id；
 */
export const submitDeleteTag = ({ tagId, type }: { tagId: number, type: TAG_DELETE_TYPE }) => httpClient.post('hqcc/w/deleteTag', {
  id: tagId,
  type
})

export const submitUpdateTagSequence = ({ tagId, parentId, sequence }) => httpClient.post('hqcc/w/updateTagSequence', {
  tagId,
  parentTagId: parentId,
  sequence
})

export const submitAsyncTagSequence = ({ isSelectAll, poiIdList } : { isSelectAll: Boolean, poiIdList: Number[] }) => httpClient.post('hqcc/w/syncTagSequence', {
  isUpdateAllPoi: isSelectAll,
  wmPoiIds: poiIdList
})

/**
 * 根据商品标题获取推荐类目
 * @param name
 */
export const getSuggestCategoryByProductName = ({ name, spuId }: { name: string, spuId: number | string }) => httpClient.post('hqcc/r/suggestCategoryByName', {
  name, spuId
}).then(data => convertCategoryBySearch(data || {}))

/**
 * 根据parentId获取后台分类
 * @param parentId
 */
export const getCategoryListByParentId = ({ parentId }: { parentId: number }) => httpClient.post('hqcc/r/listCategoryByParentId', {
  parentId
}).then(data => convertCategoryListFromServer(data.categoryList || []))

export const getWhiteListByCategory = ({ categoryId }: { categoryId: number }) => {
  return httpClient.post('hqcc/r/getValidationConfigByCategoryIds', {
    categoryIds: [categoryId]
  }).then(data => {
    const map = (data || {})[categoryId]
    return convertWhiteListModuleMapFromServer(map)
  })
}

/**
 * 级联类型的类目属性 根据parentId拉取数据
 * @param parentId 父id
 * @param attr 类目属性信息
 * @param pagination 分页信息
 */
export const getCategoryAttrListByParentId = ({ parentId, attr, pagination }: { parentId: number, attr: CategoryAttr, pagination: Pagination }) => {
  const { id, name } = attr
  return httpClient.get('hqcc/r/attrValueCascade', {
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
