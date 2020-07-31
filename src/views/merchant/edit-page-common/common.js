import { splitCategoryAttrMap } from '@/views/components/product-form/data'

export const getAttributes = (product) => {
  const { categoryAttrList, categoryAttrValueMap } = product
  return splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
}
