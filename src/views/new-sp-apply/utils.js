import { combineCategoryMap, splitCategoryAttrMap } from '@/data/helper/category/operation'

export const convertIn = (data) => {
  const {
    spId,
    name,
    upcList,
    category,
    spec,
    suggestedPrice,
    tagList,
    pictureList,
    pictureDetailList,
    categoryAttrList,
    categoryAttrValueMap
  } = data
  const {
    normalAttributes,
    normalAttributesValueMap,
    sellAttributes,
    sellAttributesValueMap
  } = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
  return {
    tagList: tagList || [],
    normalAttributes,
    normalAttributesValueMap,
    sellAttributes,
    sellAttributesValueMap,
    pictureContentList: pictureDetailList,
    pictureList,
    category,
    name,
    id: spId,
    skuList: [{
      upcCode: upcList[0],
      specName: spec,
      suggestedPrice: suggestedPrice,
      editable: true
    }]
  }
}

export const convertTo = (data) => {
  const {
    tagList,
    normalAttributes,
    normalAttributesValueMap,
    sellAttributes,
    sellAttributesValueMap,
    pictureContentList,
    pictureList,
    category,
    name,
    id,
    skuList
  } = data
  const sku = skuList[0]
  const {
    categoryAttrList,
    categoryAttrValueMap
  } = combineCategoryMap(normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap)
  return {
    spId: id,
    tagList,
    categoryAttrList,
    categoryAttrValueMap,
    pictureList,
    category,
    name,
    pictureDetailList: pictureContentList,
    upcList: [sku.upcCode],
    spec: sku.specName,
    suggestedPrice: sku.suggestedPrice
  }
}
