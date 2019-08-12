import httpClient from '../client/instance/merchant'
import {
  TagWithSort
} from '../interface/category'
import {
  TAG_DELETE_TYPE
} from '../enums/category'
import {
  convertTagList as convertTagListFromServer,
  convertTagWithSortList as convertTagWithSortListFromServer,
} from '../helper/category/convertFromServer'
import {
  convertTag as convertTagToServer
} from '../helper/category/convertToServer'

export const getTagList = () => httpClient.post('hqcc/r/tagList').then(data => {
  const {
    tagList,
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
      productTotal: totalCount
    }
  })

export const getSortedTagList = () => httpClient.post('hqcc/r/tagList').then(data => {
  const {
    tagList,
    totalCount,
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
  ...convertTagToServer(tagInfo)
})

/**
 * 一级分类调整为二级，二级分类调整为一级
 * tagId: 当前要操作的一级分类id, 或要操作的二级分类id,
 * parentId: 要调整为其二级的一级分类id, 或调整为一级分类时传0,
 */
export const submitChangeTagLevel = ({ tagId, parentId }: { tagId: number, parentId: number }) => httpClient.post('hqcc/w/changeTagLevel', {
  id: tagId,
  parentId,
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
