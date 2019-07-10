import {
  StandardProduct
} from '../../../interface/product'
import {
  convertCategoryAttrMap
} from '../utils'
import {
  convertProductSkuList
} from '../withCategoryAttr/convertFromServer'
import {
  ERROR_CORRECTION_FIELDS_MAP
} from '../../../enums/fields'

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

  const brandObj = product.brand ? ({
    id: product.brand.brandId || -1,
    spBrandId: product.brand.spBrandId,
    name: product.brand.name,
    type: product.brand.brandSourceType || 0,
  }) : ({
    id: -1,
    spBrandId: product.brandId,
    name: product.brandNamePath,
    type: product.brandSourceType || 0,
  })

  const categoryObj = product.category || {
    id: product.categoryId,
    idPath: product.categoryIdPath,
    name: product.categoryName,
    namePath: product.categoryNamePath
  }
  categoryObj.idPath = (categoryObj.idPath || '').split(',')
  categoryObj.namePath = (categoryObj.namePath || '').split(',')

  const suggestedPrice = (parseFloat(product.suggestedPrice === -1 ? undefined : product.suggestedPrice) || 0) / 10
  const maxPrice = product.riseMax === -1 ? 0 : suggestedPrice * (1 + (parseFloat(product.riseMax) || 0) / 1000)
  const minPrice = product.dropMax === -1 ? 0 : suggestedPrice * (1 - (parseFloat(product.dropMax) || 0) / 1000)

  const node: StandardProduct = {
    id: product.spId,
    name: product.name,
    brand: brandObj,
    origin: {
      id: product.origin,
      name: product.originName,
    },
    category: categoryObj,
    pictureList: (product.pic || '').split(','),
    upcCode: product.ean,
    isSp: product.isSp === 1,

    categoryAttrValueMap: valueMap,
    categoryAttrList: attrList,
    suggestedPrice,
    maxPrice,
    minPrice,
    skuList: convertProductSkuList(skus),
  }
  // 如果有月销量信息，需要保留
  if (product.monthSale !== undefined) {
    node.monthSale = product.monthSale || 0
  }
  // 如果有已存在信息，需要保留
  if (product.existInPoi !== undefined) {
    node.existInPoi = product.existInPoi;
  }
  // 如果有数据源信息，需要保留
  if (product.source !== undefined) {
    node.source = product.source;
  }

  return node
}

export const convertSpInfoList = (list: any): StandardProduct[] => {
  list = list || []
  return list.map(convertSpInfo)
}

export const convertSpUpdateInfo = (data) => {
  data = data || []
  data.sort((a, b) => a.field - b.field)
    .map((item) => {
      let {
        field, oldValue, newValue, ...others
      } = item
      const fieldName = ERROR_CORRECTION_FIELDS_MAP[field];
      if (fieldName === 'picture') {
        oldValue = oldValue.split(',').filter(v => !!v);
        newValue = newValue.split(',').filter(v => !!v);
      }
      return {
        id: field,
        field: fieldName,
        oldValue,
        newValue,
        ...others,
      }
    })
}
