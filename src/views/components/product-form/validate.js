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

// 暂不处理关联校验
export default (field, value, config) => {
  const options = {
    nodeConfig: config || {}
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
        Object.assign(options, target.options)
      }
    }
  }
  const result = validate(field, value, options)
  if (result.code === 1) {
    throw new Error(result.msg)
  }
}
