import { isArray } from 'lodash'

export const mergeConfig = (target, ...sourceList) => {
  // TODO events的合并，validate的合并
  sourceList.forEach(source => {
    source = source || {}
    // rules 合并规则
    let targetRules = []
    let sourceRules = []
    if (target.rules) {
      targetRules = isArray(target.rules) ? target.rules : [target.rules]
    }
    if (source.rules) {
      sourceRules = isArray(source.rules) ? source.rules : [source.rules]
    }
    // merge(target, source)
    Object.assign(target, source)
    target.rules = [...targetRules, ...sourceRules]
    return target
  })
  return target
}

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
