import httpClient from '../client/instance/medicineMerchant'
import { TagWithSort } from '../interface/category'
import { TAG_DELETE_TYPE } from '../enums/category'

import { convertTag as convertTagToServer } from '../helper/category/convertToServer'
import {
  convertTagWithSortList as convertTagWithSortListFromServer
} from '../helper/category/convertFromServer'

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