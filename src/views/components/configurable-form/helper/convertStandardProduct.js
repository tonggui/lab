import { splitCategoryAttrMap } from '@/data/helper/category/operation'

export default (sp) => {
  const { id, categoryAttrList, categoryAttrValueMap, ...rest } = sp
  const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
  return {
    ...rest,
    spId: id,
    ...categoryAttr
  }
}
