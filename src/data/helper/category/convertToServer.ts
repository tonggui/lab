import { isObject } from 'lodash'
import { Tag, CategoryAttrValue, CategoryAttr } from '../../interface/category'
import {
  ATTR_TYPE, VALUE_TYPE, RENDER_TYPE
} from '../../enums/category'

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
import {
  convertTimeZone
} from '@/data/helper/common/convertToServer'
import { newCustomValuePrefix } from './operation'
import { createAttrValue } from '../product/operation'

export const convertTag = (tag: Tag) => {
  const timeZone = tag.topFlag ? convertTimeZone(tag.timeZone!) : {};
  return {
    id: tag.id,
    name: tag.name,
    // sequence: tag.sequence,
    description: '',
    level: tag.level + 1,
    parentId: tag.parentId,
    top_flag: Number(tag.topFlag),
    topFlag: Number(tag.topFlag),
    isLeaf: Number(tag.isLeaf),
    // TODO timezone 问题
    time_zone: timeZone,
    topTimeZone: timeZone,
    appTagCode: tag.appTagCode
  };
}

export const convertCategoryAttr = (attr: CategoryAttr, value) => {
  const { attrType, options, valueType, render } = attr
  const node = {
    attrId: attr.id,
    attrName: attr.name,
    attrType: attrType,
    inputType: valueType,
    sequence: attr.sequence,
    isRequired: attr.required ? 1 : 0
  }
  let valueList: any[] = []
  let customValueSequence = options.length // 用户自建的属性值排序，在已有值之后
  const key = attrType === ATTR_TYPE.SELL ? 'name' : 'id'
  // 是否是及联数据
  const isCasade = [RENDER_TYPE.CASCADE, RENDER_TYPE.BRAND].includes(render.type)
  if (valueType === VALUE_TYPE.INPUT) {
    const node: CategoryAttrValue = {
      name: value, selected: true, isCustomized: false
    }
    valueList = [convertCategoryAttrValue(node)]
  } else {
    let attrValueList = [].concat(value || [])
    if (valueType === VALUE_TYPE.SINGLE_SELECT) {
      attrValueList = attrValueList.slice(0, 1)
    }
    valueList = attrValueList.map(node => {
      const v: any = isObject(node) ? node : { [key]: node }
      if (isCasade) {
        if (!v.id) {
          v.id = v.idPath && v.idPath.slice(-1)[0]
        }
        if (!v.name) {
          v.name = v.namePath && v.namePath.slice(-1)[0]
        }
      }
      const val = v[key]
      // 用户自建属性值
      if (typeof val === 'string' && val.startsWith(newCustomValuePrefix)) {
        const valueItem = createAttrValue(attr, val.slice(newCustomValuePrefix.length), customValueSequence++)
        return convertCategoryAttrValue({
          ...valueItem,
          isCustomized: true,
          selected: true
        })
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
    value: typeof attrValue.name === 'string' ? attrValue.name.trim() : attrValue.name,
    valueIdPath: (attrValue.idPath || []).join(','),
    valuePath: (attrValue.namePath || []).join(','),
    sequence: attrValue.sequence,
    selected: attrValue.selected ? 1 : 0
  }
}

export const convertTagList = (list: Tag[]) => list.map((item) => {
  const tag = convertTag(item)
  return {
    ...tag,
    subTags: item.isLeaf ? [] : convertTagList(item.children)
  }
})

export const convertTagListSort = (list: Tag[], map) => list.map((item) => {
  const tag = convertTag(item)
  return {
    ...tag,
    subTags: item.isLeaf ? [] : convertTagListSort(item.children, map),
    products: (map[item.id] || []).map((id, i) => ({ id, sequence: i }))
  }
})

export const convertTreeValueToIdList = (dataSource: Tag[], valueTree) => {
  const list = valueTree.list
  const idList: (number | string)[] = []
  dataSource.forEach((item: Tag) => {
    const node = list.find(i => i.id === item.id)
    if (!node) {
      idList.push(item.id);
      (item.children || []).forEach(i => idList.push(i.id))
      return
    }
    if (node.checked) {
      let flag = false
      item.children.forEach(i => {
        const n = node.list.find(v => v.id === i.id)
        if (!n || (n && n.checked)) {
          flag = true
          idList.push(i.id)
        }
      })
      if (flag) {
        idList.push(item.id)
      }
    }
  })
} 

