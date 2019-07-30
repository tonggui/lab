import { isObject } from 'lodash'
import { Tag, CategoryAttrValue, CategoryAttr } from '../../interface/category'
import {
  ATTR_TYPE, VALUE_TYPE
} from '../../enums/category'
import { TimeZone } from '../../interface/common';

/**
 * tagInfo: {
 *  id: "", // 修改一级、二级分类时，传一级、二级分类id；
 *  name: "分类名称",
 *  sequence: 0,
 *  description: "",
 *  level: 1, // 1-新建、修改一级分类；2-二级分类；
 *  parentId: 0, // 0-新建、修改一级分类时传0，修改二级分类时也传0；新建二级分类时传对应一级分类id；
 *  top_flag: 1, // 1-限时置顶；0-不限时置顶；null-新建二级分类；
 *  time_zone: "{}" // JSON字符串，top_flag为0或null时传空对象字符串，内部结构如下：
 * }
 * time_zone: {
 *  "2": [{ // 周二
 *    "start": "12:45",
 *    "end": "12:46"
 *  }, {
 *    "start": "12:47",
 *    "end": "12:48"
 *  }],
 *  "3": [{
 *    "start": "12:45",
 *    "end": "12:46"
 *  }, {
 *    "start": "12:47",
 *    "end": "12:48"
 *  }]
 * }
 * @param tag
 */

export const convertTimeZone = (timezone: TimeZone) => {
  const { days, timeList } = timezone
  return days.reduce((prev: any, d: number | string) => {
    prev[Number(d) + 1] = timeList
    return prev
  }, {})
}

export const convertTag = (tag: Tag) => {
  const timeZone = tag.topFlag ? convertTimeZone(tag.timeZone!) : {};
  return {
    id: tag.id,
    name: tag.name,
    sequence: tag.sequence,
    description: '',
    level: tag.level,
    parentId: tag.parentId,
    top_flag: tag.topFlag,
    topFlag: tag.topFlag,
    // TODO timezone 问题
    time_zone: timeZone,
    topTimeZone: timeZone,
    appTagCode: tag.appTagCode
  };
}

export const convertCategoryAttr = (attr: CategoryAttr, value) => {
  const { attrType, options, valueType } = attr
  const node = {
    attrId: attr.id,
    attrName: attr.name,
    attrType: attrType,
    inputType: valueType,
    sequence: attr.sequence,
    isRequired: attr.required ? 1 : 0
  }
  let valueList: any[] = []
  const key = attrType === ATTR_TYPE.SELL ? 'name' : 'id'
  if (valueType === VALUE_TYPE.INPUT) {
    const node: CategoryAttrValue = {
      name: value, selected: true, isCustomized: false
    }
    valueList = [convertCategoryAttrValue(node)]
  } else {
    let attrValueList = [].concat(value)
    if (valueType === VALUE_TYPE.SINGLE_SELECT) {
      attrValueList = attrValueList.slice(0, 1)
    }
    valueList = attrValueList.map(node => {
      const v = isObject(node) ? node : {
        [key]: node
      }
      const valueItem = options.find(n => n[key] === v[key])
      const item = {
        ...valueItem,
        ...v,
        selected: true,
      } as CategoryAttrValue;
      return convertCategoryAttrValue(item)
    })
  }
  return {
    ...node,
    valueList,
  }
}

export const convertCategoryAttrValue = (attrValue: CategoryAttrValue): any => {
  let id: any = attrValue.id
  if (attrValue.isCustomized) {
    id = ''
  }
  return {
    valueId: id,
    value: attrValue.name,
    valueIdPath: attrValue.idPath,
    valuePath: attrValue.namePath,
    sequence: attrValue.sequence,
    selected: attrValue.selected ? 1 : 0
  }
}

export const convertTagListSort = (list: Tag[], map) => list.map((item, index) => {
  return {
    id: item.id,
    parentId: item.parentId,
    isLeaf: item.isLeaf,
    sequence: index,
    subTags: item.isLeaf ? [] : convertTagListSort(item.children, map),
    products: (map[item.id] || []).map((id, i) => ({ id, sequence: i }))
  }
})
