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
  return {
    tagList: tagList || [],
    categoryAttrList,
    categoryAttrValueMap,
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
    categoryAttrList,
    categoryAttrValueMap,
    pictureContentList,
    pictureList,
    category,
    name,
    id,
    skuList
  } = data
  const sku = skuList[0]
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
