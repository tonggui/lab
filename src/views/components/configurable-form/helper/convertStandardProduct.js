import { splitCategoryAttrMap } from '@/data/helper/category/operation'

// 标品转换，分割 销售属性
// TODO 优化。从数据层洗数的时候就拆分了
export default (sp) => {
  const { id, categoryAttrList, categoryAttrValueMap, ...rest } = sp
  const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
  return {
    ...rest,
    spId: id,
    ...categoryAttr
  }
}
