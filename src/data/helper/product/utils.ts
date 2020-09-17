import {
  ProductAttribute,
  ProductLabel
} from '../../interface/product'
import {
  SELLING_TIME_TYPE
} from '../../enums/product'
import { TimeZone, Time } from '../../interface/common'
import {
  convertCategoryAttr
} from '../category/convertFromServer'
import { CategoryAttr, CategoryAttrValue } from '../../interface/category'
import { RENDER_TYPE, ATTR_TYPE, VALUE_TYPE } from '../../enums/category';

export const convertProductAttributeList = (attributeList) => {
  attributeList = attributeList || []
  const productAttributeList = [] as ProductAttribute[];
  attributeList.forEach((attr) => {
    let productAttr = productAttributeList.find(productAttr => productAttr.name === attr.name)
    if (!productAttr) {
      productAttr = {
        name: attr.name,
        value: [] as string[]
      }
      productAttributeList.push(productAttr)
    }
    productAttr.value.push(attr.value)
  });
  return productAttributeList
}

export const convertProductSellTime = (obj: any) => {
  const initState = {
    type: SELLING_TIME_TYPE.Infinite,
    timeZone: {
      days: [0, 1, 2, 3, 4, 5, 6],
      timeList: []
    } as TimeZone
  };
  if (obj !== '-') {
    try {
      obj = JSON.parse(obj);
      initState.type = SELLING_TIME_TYPE.Custom
      const days: number[] = []
      let timeList: Time[] = []
      obj.forEach((value, index) => {
        if (value.length > 0) {
          days.push(index);
          // 由于每个value的值都是一样，所以只需要处理一次就行
          if (timeList.length === 0) {
            timeList = (value as any[] || []).map(item => {
              const [start, end] = (item || '').split('-');
              return ({
                start,
                end,
                time: item
              }) as Time
            })
          }
        }
      })
      initState.timeZone = {
        days,
        timeList
      }
    } catch {
      return initState;
    }
  }
  return initState;
}

export const convertPoorPictureList = (poorImageList = []) => {
  const poorList = [false, false, false, false, false]
  if (poorImageList && poorList.length) {
    poorImageList.forEach((idx) => {
      poorList.splice(idx - 1, 1, true)
    })
  }
  return poorList
}

export const convertProductLabel = (label: any) => {
  const { id, groupName, upperLimit, spuCount } = (label || {}) as any
  const node: ProductLabel = {
    label: (groupName || '') as string,
    value: id as number,
    upperLimit,
    spuCount,
  }
  return node
}

export const convertProductLabelList = (list: any): ProductLabel[] => {
  list = list || []
  return list.map(convertProductLabel)
}

const pickUpCategoryAttrValue = (attr: CategoryAttr, valueList: CategoryAttrValue[]) => {
  const { render, valueType, attrType } = attr
  let list: (CategoryAttrValue | string | number | undefined)[] = valueList
  // 及联和品牌处理
  if (render.type !== RENDER_TYPE.CASCADE && render.type !== RENDER_TYPE.BRAND) {
    list = valueList.map(v => (attrType ===  ATTR_TYPE.SELL || valueType === VALUE_TYPE.INPUT) ? v.name : v.id)
  }
  if (valueType === VALUE_TYPE.INPUT) {
    return list[0] || ''
  }
  return valueType ===  VALUE_TYPE.SINGLE_SELECT ? list[0] : list
}

export const convertCategoryAttrMap = (map: any) => {
  const attrList: CategoryAttr[] = []
  const valueMap = {}
  Object.values(map || {})
    .sort((l: any, r: any) => l.sequence - r.sequence)
    .forEach((attr: any) => {
      const item = convertCategoryAttr(attr)
      // 从属性中取出当前选中的值
      const valueList = item.options.filter((_v) => _v.selected)
      attrList.push(item)
      valueMap[item.id] = pickUpCategoryAttrValue(item, valueList)
    })
  return {
    attrList,
    valueMap,
  };
}

export const convertMedicineCategoryAttrValueMap = (attrList: CategoryAttr[], valueMap: any) => {
  const result = {}
  attrList.sort((l: any, r: any) => l.sequence - r.sequence).forEach(attr => {
    const valueDetail = valueMap[attr.id]
    if (valueDetail) {
      result[attr.id] = attr.valueType === VALUE_TYPE.MULTI_SELECT ? (valueDetail.value ? valueDetail.value.split(',').map(v => v ? v + '' : v) : []) : (valueDetail.value ? valueDetail.value + '' : '')
    }
  })
  return result
}
