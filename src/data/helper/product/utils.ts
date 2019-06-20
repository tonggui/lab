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
import { CategoryAttr } from '../../interface/category'

export const convertProductAttributeList = (attributeList) => {
  attributeList = attributeList || []
  const map = {};
  attributeList.forEach((attr) => {
    const valueList = map[attr.name] || [];
    valueList.push(attr.value);
    map[attr.name] = valueList;
  });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  } as ProductAttribute));
}

export const convertProductSellTime = (value) => {
  const initState = {
    type: SELLING_TIME_TYPE.Infinite,
    timeList: [
      { day: 0, timezone: [] },
      { day: 1, timezone: [] },
      { day: 2, timezone: [] },
      { day: 3, timezone: [] },
      { day: 4, timezone: [] },
      { day: 5, timezone: [] },
      { day: 6, timezone: [] },
    ] as TimeZone[],
  };
  if (value !== '-') {
    initState.type = SELLING_TIME_TYPE.Custom;
    const timezoneList = value;
    initState.timeList.forEach((item, idx) => {
      const val = timezoneList[idx] || [];
      if (val.length > 0) {
        item.timezone = val.map(v => {
          const [start, end] = (v || '').split('-');
          return ({
            start,
            end,
            time: v
          }) as Time;
        });
      }
    });
  }
  return initState;
}

export const convertPoorPictureList = (poorImageList = []) => {
  const poorList = [false, false, false, false, false]
  if (poorList.length) {
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

export const convertCategoryAttrMap = (map: any) => {
  const attrList: CategoryAttr[] = []
  const valueMap = {}
  Object.values(map || {})
    .sort((l: any, r: any) => l.sequence - r.sequence)
    .forEach((attr: any) => {
      const item = convertCategoryAttr(attr)
      // 从属性中取出当前选中的值
      const valueList = item.options.filter((_v, i) => attr.valueList[i].selected === 1)
      attrList.push(item)
      valueMap[item.id] = valueList
    })
  return {
    attrList,
    valueMap,
  };
}