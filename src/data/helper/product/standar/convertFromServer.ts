import { toNumber, get } from 'lodash'
import {
  StandardProduct,
  MedicineStandardProduct,
  DiffInfo
} from '../../../interface/product'
import {
  convertCategoryAttrMap,
  isJSON
} from '../utils'
import {
  convertProductSkuList,
  convertProductWeight,
  convertProductCategory
} from '../withCategoryAttr/convertFromServer'
import {
  ERROR_CORRECTION_FIELDS_MAP
  , SP_CHANGE_FIELD } from '../../../enums/fields'
import { QUALIFICATION_STATUS } from '../../../enums/product'

import { trimSplit } from '@/common/utils'

import { convertProductBrandVideoFromServer } from '@/data/helper/product/base/convertFromServer'
import { convertCategoryAttrValue } from '@/data/helper/category/convertFromServer.ts'
import { VALUE_TYPE, RENDER_TYPE, ATTR_TYPE } from '@/data/enums/category'
import { splitCategoryAttrMap } from '@/data/helper/category/operation'

export const convertSpInfo = (product: any): StandardProduct => {
  const {
    categoryAttrMap,
    spuSaleAttrMap,
    skus = []
  } = product
  const attrMap = {
    ...categoryAttrMap,
    ...spuSaleAttrMap
  }
  const { attrList, valueMap } = convertCategoryAttrMap(attrMap)
  const categoryAttr = splitCategoryAttrMap(attrList, valueMap)

  const brandObj = product.brand ? ({
    id: product.brand.brandId || -1,
    spBrandId: product.brand.spBrandId,
    name: product.brand.name,
    type: product.brand.brandSourceType || 0
  }) : ({
    id: -1,
    spBrandId: product.brandId,
    name: product.brandNamePath,
    type: product.brandSourceType || 0
  })

  const categoryObj = product.category || {
    id: product.categoryId,
    idPath: product.categoryIdPath,
    name: product.categoryName,
    namePath: product.categoryNamePath
  }
  categoryObj.idPath = trimSplit(categoryObj.idPath).map(v => +v)
  categoryObj.namePath = trimSplit(categoryObj.namePath)

  const suggestedPrice = (parseFloat(product.suggestedPrice === -1 ? undefined : product.suggestedPrice) || 0) / 10
  const maxPrice = product.riseMax === -1 ? 0 : suggestedPrice * (1 + (parseFloat(product.riseMax) || 0) / 1000)
  const minPrice = product.dropMax === -1 ? 0 : suggestedPrice * (1 - (parseFloat(product.dropMax) || 0) / 1000)

  const isSp = product.isSp === 1
  const node: StandardProduct = {
    id: product.spId || product.id || '',
    name: product.name,
    brand: brandObj,
    origin: {
      id: product.origin,
      name: product.originName
    },
    category: categoryObj,
    pictureList: trimSplit(product.pic),
    spPictureContentList: trimSplit(product.spPicContent),
    spVideo: convertProductBrandVideoFromServer(product.spVideoVo),
    upcCode: isSp ? product.ean : '',
    isSp,

    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    suggestedPrice,
    maxPrice,
    minPrice,
    skuList: convertProductSkuList(skus, isSp),
    qualificationStatus: product.lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: product.lockTips,
    spId: product.spId || product.id || '',
    existInRecycle: product.existInRecycle || false,
    tagId: Number(product.tagId),
    tagName: product.tagName || '',
    ...categoryAttr
  }
  // 如果有月销量信息，需要保留
  if (product.monthSale !== undefined) {
    node.monthSale = product.monthSale || 0
  }
  // 如果有已存在信息，需要保留
  if (product.existInPoi !== undefined) {
    node.existInPoi = product.existInPoi
  }
  // 如果有数据源信息，需要保留
  if (product.source !== undefined) {
    node.source = product.source
  }
  // 如果有医保，需要保留
  if (product.isMedicare !== undefined) {
    node.isMedicare = product.isMedicare ? '是' : '否'
  }
  return node
}

export const convertMedicineSpInfo = (product: any): MedicineStandardProduct => {
  const node: MedicineStandardProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    upcCode: product.upcCode,
    spec: product.specification,
    price: product.currentPrice,
    stock: 0,
    suggestedPrice: product.originPrice,
    tagNameList: product.categoryList || [],
    isSale: +product.isSale === 1,
    otcType: product.isOtc,
    valid: +product.canChoose === 1,
    manufaturer: product.manufaturer,
    pictureList: product.pictureList,
    permissionNumber: product.permissionNumber,
    qualificationStatus: product.lockStatus || QUALIFICATION_STATUS.YES,
    qualificationTip: product.lockTips || '',
    recoverySymbol: product.recoverySymbol || 0,
    detailSymbol: product.detailSymbol || 0
  }
  return node
}

export const convertSpInfoList = (list: any): StandardProduct[] => {
  list = list || []
  return list.map(convertSpInfo)
}

export const convertMedicineSpInfoList = (list: any): MedicineStandardProduct[] => {
  list = list || []
  return list.map(convertMedicineSpInfo)
}

export const convertSpUpdateInfo = (data): DiffInfo[] => {
  data = data || []
  return data.sort((a, b) => a.field - b.field)
    .map((item) => {
      let {
        field, oldValue, newValue, ...others
      } = item
      const fieldName = ERROR_CORRECTION_FIELDS_MAP[field]
      if (fieldName === 'PICTURE') {
        oldValue = trimSplit(oldValue)
        newValue = trimSplit(newValue)
      } else if (fieldName === 'WEIGHT') {
        oldValue = convertProductWeight(toNumber(oldValue))
        newValue = convertProductWeight(toNumber(newValue))
      }
      return {
        id: field,
        field: fieldName,
        oldValue,
        newValue,
        ...others
      }
    })
}

export const convertSpChangeInfo = (data): { basicInfoList: DiffInfo[], categoryAttrInfoList: DiffInfo[] } => {
  const { basicInfoList = [], categoryInfoList: categoryAttrInfoList = [] } = data || {}
  const _basicInfoList: DiffInfo[] = []
  basicInfoList.forEach(basicInfo => {
    // TODO
    let { oldValue, newValue, field } = basicInfo
    field = Number(field)
    if (!Object.values(SP_CHANGE_FIELD).includes(field)) {
      return
    }
    if (field === SP_CHANGE_FIELD.PICTURE_LIST) {
      oldValue = trimSplit(oldValue)
      newValue = trimSplit(newValue)
    } else if (field === SP_CHANGE_FIELD.WEIGHT) {
      oldValue = convertProductWeight(toNumber(oldValue))
      newValue = convertProductWeight(toNumber(newValue))
    } else if (field === SP_CHANGE_FIELD.CATEGORY) {
      oldValue = isJSON(oldValue) ? convertProductCategory(JSON.parse(oldValue)) : { namePath: trimSplit(oldValue) }
      newValue = isJSON(newValue) ? convertProductCategory(JSON.parse(newValue)) : { namePath: trimSplit(newValue) }
    }
    _basicInfoList.push({
      field,
      oldValue,
      newValue
    })
  })

  return {
    basicInfoList: _basicInfoList,
    categoryAttrInfoList: categoryAttrInfoList || []
  }
}

export const convertMerchantSpChangeInfo = (data): { basicInfoList: DiffInfo[], categoryAttrInfoList: DiffInfo[] } => {
  const { basicInfoList = [], categoryInfoList: categoryAttrInfoList = [], categoryAttrAndValueList: attrs = [], ...rest } = data || {}
  const _basicInfoList: DiffInfo[] = []
  basicInfoList.forEach(basicInfo => {
    let { oldValue, newValue, field } = basicInfo
    field = Number(field)
    if (!Object.values(SP_CHANGE_FIELD).includes(field)) {
      return
    }
    if (field === SP_CHANGE_FIELD.PICTURE_LIST) {
      oldValue = trimSplit(oldValue)
      newValue = trimSplit(newValue)
    } else if (field === SP_CHANGE_FIELD.WEIGHT) {
      oldValue = convertProductWeight(toNumber(oldValue))
      newValue = convertProductWeight(toNumber(newValue))
    } else if (field === SP_CHANGE_FIELD.CATEGORY) {
      oldValue = isJSON(oldValue) ? convertProductCategory(JSON.parse(oldValue)) : { namePath: trimSplit(oldValue) }
      newValue = isJSON(newValue) ? convertProductCategory(JSON.parse(newValue)) : { namePath: trimSplit(newValue) }
    }
    _basicInfoList.push({
      field,
      oldValue,
      newValue
    })
  })

  const changes:any[] = []
  categoryAttrInfoList.forEach(item => {
    const attr = attrs.find(v => `${v.id}` === item.field)
    if (attr) {
      const renderType = get(attr, 'render.type')
      const valueType = get(attr, 'valueType')
      const attrType = get(attr, 'attrType')
      let newValue:any = get(item, 'newValue')
      let oldValue:any = get(item, 'oldValue')

      newValue = [newValue ? convertCategoryAttrValue(newValue, attrs, item.sequence - 1) : {}]
      oldValue = [oldValue ? convertCategoryAttrValue(oldValue, attrs, item.sequence - 1) : {}]

      if (attr.valueType === VALUE_TYPE.MULTI_SELECT) {
        oldValue = oldValue ? oldValue.split(',').map(v => v ? v + '' : v) : []
        newValue = newValue ? newValue.split(',').map(v => v ? v + '' : v) : []
      }
      if (renderType !== RENDER_TYPE.CASCADE && renderType !== RENDER_TYPE.BRAND) {
        oldValue = oldValue.map(v => (attrType === ATTR_TYPE.SELL || valueType === VALUE_TYPE.INPUT) ? v.name : v.id)
        newValue = newValue.map(v => (attrType === ATTR_TYPE.SELL || valueType === VALUE_TYPE.INPUT) ? v.name : v.id)
      }

      oldValue = oldValue[0]
      newValue = newValue[0]

      changes.push({
        ...attr,
        oldValue,
        newValue
      })
    }
  })

  return {
    basicInfoList: _basicInfoList,
    categoryAttrInfoList: changes,
    ...rest
  }
}
