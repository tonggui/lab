import { defaultTo } from 'lodash'
import { Category, Tag, CategoryAttr, CategoryAttrValue, CategoryTemplate, BaseCategoryTemplate, TagWithSort } from '../../interface/category'
import { TimeZone } from '../../interface/common'
import {
  VALUE_TYPE, ATTR_TYPE,
  SPECIAL_CATEGORY_ATTR,
  RENDER_TYPE
} from '../../enums/category';

/**
 * 清洗后台类目
 * @param category 接口返回的后台类型
 */
export const convertCategory = (category: any): Category => {
  const node: Category = {
    id: category.id,
    idPath: category.idPath,
    name: category.name,
    namePath: category.namePath,
    level: category.level,
    isLeaf: (+category.isLeaf) === 1
  }
  return node
}
/**
 * 清洗后台类目列表
 * @param list 列表
 */
export const convertCategoryList = (list: any[]): Category[] => list.map(convertCategory)
/**
 * 清洗时间区域
 * @param obj 
 */
export const convertTimeZone = (obj: object) => Object.entries(obj).reduce((prev, [key, value]) => {
  prev[key] = {
    day: key,
    timezone: (value || []).map(v => v),
  } as TimeZone;
  return prev;
}, []);
/**
 * 清洗店内分类
 * @param tag 店内分类
 * @param parentId 父id
 */
export const convertTag = (tag: any, parentId = 0, level = 0): Tag => {
  const node: Tag = {
    id: tag.id,
    name: tag.name,
    level: level,
    sequence: tag.sequence,
    parentId,
    children: convertTagList(tag.subTags || [], tag.id, level + 1),
    isLeaf: !tag.subTags || tag.subTags.length <= 0,
    productCount: tag.productCount || 0,
    isUnCategorized: tag.name === '未分类',
  };
  return node
}
/**
 * 清洗店内分类列表
 * @param list
 * @param parentId
 */
export const convertTagList = (list: any[], parentId?, level?): Tag[] => list.map((tag) => convertTag(tag, parentId, level))
/**
 * 清洗带分类置顶和排序的店内分类
 * @param tag
 * @param parentId
 */
export const convertTagWithSort = (tag: any, parentId = 0, level = 0): TagWithSort => {
  const node: Tag = convertTag(tag, parentId, level);
  const result: TagWithSort = {
    ...node,
    parentId,
    children: convertTagWithSortList(tag.subTags || [], tag.id, level + 1),
    isSmartSort: !!tag.smartSort,
    defaultFlag: (+tag.defaultFlag) === 1,
    topFlag: (+tag.topFlag) === 1,
    timeZoneForHuman: tag.timeZoneForHuman,
    appTagCode: tag.appTagCode,
    timeZone: convertTimeZone(tag.timeZoneObj || {}),
  }
  return result
}
/**
 * 清洗带分类置顶和排序的店内分类
 * @param list
 * @param parentId
 */
export const convertTagWithSortList = (list: any[], parentId?, level?): TagWithSort[] => list.map((tag) => convertTagWithSort(tag, parentId, level))

/**
 * 清洗类目属性
 * @param attr
 */
export const convertCategoryAttr = (attr): CategoryAttr => {
  attr = attr || {}
  // TODO 因为类目属性接口和商品详情接口中相同含义字段名不同
  let valueType = defaultTo(attr.inputType, attr.inputType)
  const { attrType, attrId, attrName } = attr
  // TODO 控制销售属性 销售属性的 type只能是多选
  if (attrType === ATTR_TYPE.SELL) {
    valueType = VALUE_TYPE.MULTI_SELECT
  }
  let render = {} as any
  if (attrId === SPECIAL_CATEGORY_ATTR.BRAND) {
    render = {
      type: RENDER_TYPE.CASCADE,
      attribute: {
        search: true,
        cascade: false
      }
    }
  } else if (attrId === SPECIAL_CATEGORY_ATTR.ORIGIN) {
    render = {
      type: RENDER_TYPE.CASCADE,
      attribute: {
        search: true,
        cascade: true,
        maxCount: 1
      }
    }
  } else {
    render.type = valueType === VALUE_TYPE.INPUT ? RENDER_TYPE.INPUT : RENDER_TYPE.SELECT
  }
  const node: CategoryAttr = {
    id: attrId,
    name: attrName,
    attrType,
    valueType,
    // TODO 因为类目属性接口和商品详情接口中相同含义字段名不同
    required: +(defaultTo(attr.isRequired, attr.need)) === 1,
    sequence: attr.sequence,
    options: [],
    render,
  }
  node.options = convertCategoryAttrValueList(attr.valueList || [], node)
  return node
}
/**
 * 清洗类目属性值
 * @param attrValue
 * @param attr
 */
export const convertCategoryAttrValue = (attrValue, attr?): CategoryAttrValue => {
  attrValue = attrValue || {}
  attr = attr || {}
  const node: CategoryAttrValue = {
    id: attrValue.valueId,
    name: attrValue.value,
    isCustomized: attrValue.valueId, // TODO 自定义属性没有valueId，不是很稳定
    namePath: attrValue.valuePath ? attrValue.valuePath.split(',') : [],
    idPath: attrValue.valueIdPath ? attrValue.valueIdPath.split(',').map(id => +id).filter(id => !!id) : [],
    sequence: attrValue.sequence,
    isLeaf: (+attrValue.isLeaf) === 1,
    parentId: attr.id || attrValue.attrId,
    parentName: attr.name || attrValue.attrName,
    selected: false
  }
  return node;
}
/**
 * 清洗类目属性值列表
 * @param list
 * @param attr 
 */
export const convertCategoryAttrValueList = (list: any[], attr?): CategoryAttrValue[] => list.map((attrValue) => convertCategoryAttrValue(attrValue, attr))
/**
 * 清洗类目属性列表
 * @param list
 */
export const convertCategoryAttrList = (list: any[]): CategoryAttr[] => list.map(convertCategoryAttr)
/**
 * 清洗模版概要信息
 * @param template 模版概要信息
 */
export const convertBaseCategoryTemplate = (template: any): BaseCategoryTemplate => {
  const {
    templateId, templateTitle, usageFlag, type,
  } = template
  const node: BaseCategoryTemplate = {
    id: templateId,
    name: templateTitle || '',
    selected: usageFlag === 1 || usageFlag === 2,
    updated: usageFlag === 2,
    used: usageFlag === 1 || usageFlag === 2,
    editable: type === 1,
    type,
  }
  return node
}
/**
 * 清洗模版概要信息列表
 * @param list 概要信息列表
 */
export const convertBaseCategoryTemplateList = (list: any[]): BaseCategoryTemplate[] => list.map(convertBaseCategoryTemplate)

export const convertCategoryTemplateTag = (list, level = 1, parentId = 0): Tag[] => {
  list = list || []
  return list.map(({ tagId, tagName, categoryIdList, subTags }) => {
    const isLeaf = !subTags || subTags.length <= 0;
    const node: Tag = {
      id: tagId,
      name: tagName,
      categoryIdList,
      isLeaf,
      level,
      parentId,
      sequence: 0,
      children: isLeaf ? [] : convertCategoryTemplateTag(subTags, level + 1, tagId),
      isUnCategorized: tagName === '未分类' // TODO
    }
    return node
  })
}
/**
 * 清洗模版详细信息
 * @param template 模版信息
 * @param baseTemplate 模版概要信息
 */
export const convertCategoryTemplate = (template: any, baseTemplate: BaseCategoryTemplate): CategoryTemplate => {
  const {
    templateId,
    templateTitle,
    useScene,
    version,
    type,
    usageQuantity,
    avClassificateConvert,
    tagInfoList,
  } = template
  const node: CategoryTemplate = {
    ...baseTemplate,
    id: templateId, // 模版id
    name: templateTitle || '', // 模版名称
    description: useScene || '', // 模版使用场景
    version: version, // 模版版本
    type: type, // 模版类型 B端：1，C端：2
    times: usageQuantity, // 模版使用次数
    conversionRate: avClassificateConvert, // 分类平均转化转化率
    tagInfoList: convertCategoryTemplateTag(tagInfoList), // 分类信息
    value: [], // 全选
  }
  return node
}
