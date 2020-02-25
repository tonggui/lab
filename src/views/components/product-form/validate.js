/*
 * @description
 *   Please write the validate script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-17)
 */
import { isString, isPlainObject, isFunction } from 'lodash'
import { validate } from '@sgfe/product-validate'
import { WEIGHT_UNIT } from '@/data/enums/product'

const weightTrans = {
  [WEIGHT_UNIT.G]: v => v,
  [WEIGHT_UNIT.ML]: v => v,
  [WEIGHT_UNIT.L]: v => v * 1000,
  [WEIGHT_UNIT.KG]: v => v * 1000,
  [WEIGHT_UNIT.P]: v => v * 454,
  [WEIGHT_UNIT.JIN]: v => v * 500,
  [WEIGHT_UNIT.LIANG]: v => v * 50
}

export const weightOverflow = (weight, maxWeight) => {
  return weightTrans[weight.unit](weight.value) > (maxWeight ? weightTrans[maxWeight.unit](maxWeight.value) : 10000) // 默认不能超过10000g
}

const mapper = {
  name: 'title',
  category: {
    key: 'categoryName',
    value: (v = {}) => v.name
  },
  brand: {
    key: 'brandName',
    value: (v = {}) => v.name
  },
  pictureList: {
    key: 'picture',
    options: {
      noGap: true
    }
  }
}

const convertSku = (sku = {}) => {
  return {
    name: sku.specName,
    price: sku.price && sku.price.value,
    weight: sku.weight && sku.weight.value,
    weightUnit: sku.weight && sku.weight.unit,
    stock: sku.stock || 0,
    ladderPrice: sku.box && sku.box.price,
    ladderNum: sku.box && sku.box.count,
    code: sku.sourceFoodCode,
    shelfCode: sku.shelfNum
  }
}

const skuValidator = (sku, ignore) => {
  const target = convertSku(sku)
  const skuKeys = Object.keys(target)
  for (let i = 0; i < skuKeys.length; i++) {
    const skuKey = skuKeys[i]
    // 需要忽略的不进行校验
    if (!ignore[skuKey]) {
      const nodeKey = `sku.${skuKey}`
      const result = validate(nodeKey, target[skuKey], {
        sku: target,
        nodeConfig: { required: false }
      })
      if (result.code === 1) throw new Error(result.msg)
    }
  }
}

const skusValidator = (skus = [], ignore) => {
  const soldSkus = skus.filter(sku => sku.editable)
  if (soldSkus.length <= 0) {
    throw new Error('售卖信息列表必须有一条售卖中的信息')
  }
  soldSkus.forEach(sku => skuValidator(sku, ignore))
}

// 暂不处理关联校验
export default (field, value, config) => {
  const nodeConfig = config || {}
  if (field === 'skuList') {
    skusValidator(value, config.ignore || {})
    return
  }
  const target = mapper[field]
  if (target) {
    if (isString(target)) {
      field = target
    } else if (isPlainObject(target)) {
      field = target.key || field
      if (isFunction(target.value)) {
        value = target.value(value)
      }
      if (target.options) {
        Object.assign(nodeConfig, target.options)
      }
    }
  }
  const result = validate(field, value, { nodeConfig })
  if (result.code === 1) {
    throw new Error(result.msg)
  }
}
