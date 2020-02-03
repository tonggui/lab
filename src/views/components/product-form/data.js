/*
 * @description
 *   Please write the data script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-17)
 */
export const splitCategoryAttrMap = (list = [], map = {}) => {
  const sellAttributes = list.filter(attr => attr.attrType === 2)
  const normalAttributes = list.filter(attr => attr.attrType !== 2)
  const normalAttributesValueMap = normalAttributes.reduce((v, attr) => ({ ...v, [attr.id]: map[attr.id] }), {})
  const sellAttributesValueMap = sellAttributes.reduce((v, attr) => ({ ...v, [attr.id]: map[attr.id] || [] }), {})
  return {
    normalAttributes,
    normalAttributesValueMap,
    sellAttributes,
    sellAttributesValueMap
  }
}

export const combineCategoryMap = (normalAttrs = [], sellAttrs = [], normalAttrsValue = {}, sellAttrsValue = {}) => {
  return {
    categoryAttrList: [].concat(normalAttrs, sellAttrs),
    categoryAttrValueMap: {
      ...normalAttrsValue,
      ...sellAttrsValue
    }
  }
}
