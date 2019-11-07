import httpClient from '../client/instance/product'
import {
  Tag,
  CategoryAttr,
  BaseCategoryTemplate,
  CategoryTemplate
} from '../interface/category'
import {
  Pagination
} from '../interface/common'
import {
  TAG_DELETE_TYPE,
  TEMPLATE_TYPE
} from '../enums/category'
import {
  TOP_STATUS
} from '../enums/common'
import {
  convertTagList as convertTagListFromServer,
  convertCategoryList as convertCategoryListFromServer,
  convertCategoryListBySearch as convertCategoryListBySearchFromServer,
  convertCategoryAttrList as convertCategoryAttrListFromServer,
  convertCategoryAttrValueList as convertCategoryAttrValueListFromServer,
  convertBaseCategoryTemplateList as convertBaseCategoryTemplateListFromServer,
  convertCategoryTemplate as convertCategoryTemplateFromServer,
  convertCategoryTemplateTag as convertCategoryTemplateTagFromServer,
  convertTagWithSortList as convertTagWithSortListFromServer,
} from '../helper/category/convertFromServer'
import {
  convertProductInfoWithPagination as convertProductInfoWithPaginationFromServer,
} from '../helper/product/base/convertFromServer'
import {
  convertTask as convertTaskFromServer,
} from '../helper/common/convertFromServer'
import {
  convertTag as convertTagToServer
} from '../helper/category/convertToServer'

/**
 * 获取门店的店内分类信息
 * 包括门店店内分类 + 排序置顶等信息
 * @param poiId
 */
export const getPoiTagInfo = ({ poiId, needSmartSort }: { poiId: number, needSmartSort: boolean }) => httpClient.post('retail/r/tagList', {
  wmPoiId: poiId,
  needSmartSort: !!needSmartSort
}).then(data => {
  const {
    tagList,
    smartSortSwitch,
    tagToTopLimit,
    totalCount,
  } = (data || {}) as any
  return {
    tagList: convertTagWithSortListFromServer(tagList),
    tagInfo: {
      smartSortSwitch: !!smartSortSwitch,
      topLimit: tagToTopLimit,
      productTotal: totalCount,
    }
  }
})
/**
 * 获取店内分类列表
 * @param poiId
 */
export const getTagList = ({ poiId }: { poiId: number }): Tag[] => httpClient.post('retail/r/tagList', {
  wmPoiId: poiId
}).then(data => {
  const { tagList } = (data || {}) as any
  return convertTagListFromServer(tagList)
})
/**
 * 排序店内分类
 * @param tagIdList
 */
export const submitUpdateTagSequence = ({ tagIdList, poiId }: { tagIdList: number[], poiId: number }) => httpClient.post('food/w/batchUpdateTagSequence', {
  tagIds: tagIdList.join(','),
  wmPoiId: poiId
})
/**
 *  店内分类置顶／取消
 * @param type: 1-置顶；2-取消；
 * @param tagId：分类id；
 * @param sequence 顺序
 */
export const submitToggleTagToTop = ({ poiId, isSmartSort, tagId, sequence }: { poiId: number, isSmartSort: boolean, tagId: number, sequence: number }) => httpClient.post('retail/w/tag/toTop', {
  wmPoiId: poiId,
  type: isSmartSort ? TOP_STATUS.TOP : TOP_STATUS.NOT_TOP,
  tagId,
  seq: sequence,
})
/**
 * 店内分类智能排序 开启/关闭
 * @param type
 */
export const submitToggleTagSmartSort = ({ poiId, status }: { poiId: number, status: boolean }) => httpClient.post('retail/w/tag/smartSortSwitch', {
  wmPoiId: poiId,
  type: status ? 1 : 2
})
/**
 * 新建、修改一级分类、二级分类
 */
export const submitAddTag = ({ poiId, tagInfo }: { poiId: number, tagInfo: Tag }) => httpClient.post('food/w/saveWmProductTag', {
  wmPoiId: poiId,
  tagInfo: JSON.stringify([convertTagToServer(tagInfo)]),
})
/**
 * 删除一级、二级分类
 * @param tagId 要删除的一级分类id，或要删除的二级分类id,
 */
export const submitDeleteTag = ({ poiId, tagId }: { tagId: number, poiId: number }) => httpClient.post('food/w/deleteTag', {
  wmPoiId: poiId,
  tagId
})
/**
 * 删除分类
 * @param: type: 操作类型：1-删除分类中的商品及二级分类；2-仅删除分类；
 * @param: tagId: 分类id；
 */
export const submitDeleteTagAndProduct = ({ poiId, type, tagId }: { poiId: number, type: TAG_DELETE_TYPE, tagId: number }) => httpClient.post('retail/w/tag/delete', {
  wmPoiId: poiId,
  type,
  tagId
})
/**
 * 一级分类调整为二级，二级分类调整为一级
 * tagId: 当前要操作的一级分类id, 或要操作的二级分类id,
 * parentId: 要调整为其二级的一级分类id, 或调整为一级分类时传0,
 */
export const submitChangeTagLevel = ({ poiId, tagId, parentId }: { poiId: number, tagId: number, parentId: number | string }) => httpClient.post('food/w/changeTagLevel', {
  wmPoiId: poiId,
  tagId,
  parentId,
})
/**
 * 根据parentId获取后台分类
 * @param parentId
 */
export const getCategoryListByParentId = ({ parentId, poiId }: { parentId: number, poiId: number | string } ) => httpClient.post('retail/r/listCategoryByParentId', {
  parentId,
  wmPoiId: poiId
}).then(data => convertCategoryListFromServer(data.categoryList || []))
/**
 * 根据关键词搜索后台类目
 * @param keyword
 */
export const getCategoryByName = ({ keyword, poiId }: { keyword: string, poiId: number | string }) => httpClient.post('retail/r/searchCategoryByName', {
  keyword,
  wmPoiId: poiId
}).then(data => {
  const list = data ? (data.leafCategoryList) : []
  const result = list.filter(v => v.isLeaf === 1)
  return convertCategoryListBySearchFromServer(result)
})
/**
 * 获取类目属性开关状态
 * @param poiIds 门店id
 */
export const getCategoryAttrSwitch = ({ poiIdList }: { poiIdList: number[] }) => {
  const wmPoiIds = ([] as number[]).concat(poiIdList).join(',')
  return httpClient.get('shangou/r/getCategoryAttrSwitch', {
    wmPoiIds, wmPoiId: wmPoiIds
  }).then(({ categoryAttrSwitch }) => !!categoryAttrSwitch)
}

/**
 * 获取类目属性
 * @param categoryId 后台类目id
 */
export const getCategoryAttrList = ({ categoryId }: { categoryId: number }) => httpClient.get('retail/r/getCategoryAttrAndValues', {
  categoryId,
}).then(data => {
  const { attrAndValueList = [] } = data || {}
  return convertCategoryAttrListFromServer(attrAndValueList || [])
})
/**
 * 类目属性sug
 * @param attr 类目属性
 * @param filter 筛选参数{ keyword: 关键词, pagination: 分页信息 }
 */
export const getCategoryAttrListByName = ({ attr, filter } :{ attr: CategoryAttr, filter: { keyword: string, pagination?: Pagination } }) => {
  const { id, name } = attr
  const { keyword, pagination = {} } = filter
  const { pageSize, current } = pagination as Pagination
  return httpClient.get('shangou/r/attrValueSug', {
    code: id,
    name,
    keyword,
    pageSize,
    pageNum: current,
  }).then(data => {
    let { categoryAttrValueVos = [] } = data || {};
    categoryAttrValueVos = (categoryAttrValueVos || []).filter(v => +v.isLeaf === 1)
    return {
      data: convertCategoryAttrValueListFromServer(categoryAttrValueVos),
      pagination: {
        ...pagination,
        total: categoryAttrValueVos.length,
      }
    }
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
  // 暂时不加分页
  // const { pageSize, current } = pagination
  return httpClient.get('shangou/r/attrValueCascade', {
    code: id,
    name,
    parentId,
    // pageNum: current,
    // pageSize
  }).then(data => {
    const { categoryAttrValueVos = [] } = data || {}
    return {
      data: convertCategoryAttrValueListFromServer(categoryAttrValueVos),
      pagination: {
        ...pagination,
        total: categoryAttrValueVos.length,
      }
    };
  })
}
/**
 * 获取分类模版概要信息列表
 */
export const getCategoryTemplateList = ({ poiId }: { poiId: number }) => httpClient.post('categoryTemplate/r/getList', {
  wmPoiId: poiId
}).then(data => convertBaseCategoryTemplateListFromServer(data))
/**
 * 获取分类模版详细信息
 * @param baseTemplate 模版概要信息
 */
export const getCategoryTemplateDetail = ({ poiId, template: baseTemplate }:{ poiId: number, template: BaseCategoryTemplate }) => httpClient.post('categoryTemplate/r/getDetail', {
  wmPoiId: poiId,
  templateId: baseTemplate.id,
  type: baseTemplate.type,
}).then(template => {
  return convertCategoryTemplateFromServer(template, baseTemplate)
})
/**
 * 分类模版预览
 * @param template
 */
export const getCategoryTemplatePreview = ({ poiId, template }: { poiId: number, template: CategoryTemplate }) => {
  const {
    id,
    type,
    version,
    value
  } = template
  return httpClient.post('categoryTemplate/r/preview', {
    wmPoiId: poiId,
    templateId: id,
    type,
    tagIds: value, // TODO
    version,
  }).then(data => convertCategoryTemplateTagFromServer(data.tagInfoList))
}
/**
 * 分类模版应用
 * @param template 模版
 */
export const submitApplyCategoryTemplate = ({ poiId, template }: { poiId: number, template: CategoryTemplate }) => {
  const {
    id,
    type,
    version,
    value
  } = template
  return httpClient.post('categoryTemplate/w/applyTagTemplate', {
    wmPoiId: poiId,
    templateId: id,
    type,
    tagIds: (value || []).join(','),
    version,
  })
}
/**
 * 分类模版预览 商品信息获取
 * @param
 */
export const getCategoryTemplateProductList = ({
  poiId,
  pagination,
  currentTag,
  templateType,
  statusList,
  status
}: {
  poiId: number,
  pagination: Pagination,
  currentTag: Tag,
  templateType: TEMPLATE_TYPE,
  statusList,
  status,
}) => {
  const firstTagId = currentTag.parentId || currentTag.id;
  const secondTagId = currentTag.parentId && currentTag.id;
  const params = {
    wmPoiId: poiId,
    firstTagId,
    secondTagId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    state: status,
    categoryIds: currentTag.categoryIdList,
    templateType
  }
  return httpClient.post('categoryTemplate/r/searchByCond', params)
    .then(data => convertProductInfoWithPaginationFromServer(data, {
      pagination,
      statusList,
    }));
}
/**
 * 分类模版 重试
 */
export const submitRetryCategoryTemplateApply = ({ poiId }: { poiId: number }) => httpClient.post('categoryTemplate/w/failRetry', {
  wmPoiId: poiId
})
/**
 * 查询分类模版应用任务状态
 * @param taskId
 */
export const getCategoryTemplateTaskStatus = (params: { taskId: number }) => httpClient.get('task/r/getTaskById', params)
  .then(data => {
    // TODO
    data = data || {}
    return convertTaskFromServer(data)
  })
/**
 * 获取热销一级商品类目
 */
export const getHotCategory = ({ poiId }: { poiId: number }) => httpClient.post('retail/r/getSpCategoryListByPoi', {
  wmPoiId: poiId
}).then(data => {
  let { list } = (data || {}) as any
  list = list || []
  return convertCategoryListFromServer(list)
})

