import { validate } from '@sgfe/product-validate'
import { SPU_FIELD } from './field'
import { VIDEO_STATUS } from '@/data/constants/video'
import { noop, get } from 'lodash'

const validator = (...args) => {
  const result = validate(...args)
  if (result.code === 1) {
    return result.msg
  }
}

const map = {
  name: {
    key: 'specName',
    value: 'specName'
  },
  price: {
    key: 'price',
    value: 'price.value'
  },
  weight: {
    key: 'weight',
    value: 'weight.value'
  },
  weightUnit: {
    key: 'weight',
    value: 'weight.unit'
  },
  stock: {
    key: 'stock',
    value: 'stock'
  },
  ladderPrice: {
    key: 'box',
    value: 'box.price'
  },
  ladderNum: {
    key: 'box',
    value: 'box.count'
  },
  code: {
    key: 'sourceFoodCode',
    value: 'sourceFoodCode'
  },
  shelfCode: {
    key: 'shelfNum',
    value: 'shelfNum'
  }
}

const convertSku = (sku) => {
  return Object.entries(map).reduce((prev, [targetKey, { value: sourceValueKey }]) => {
    prev[targetKey] = get(sku, sourceValueKey)
    return prev
  }, {})
}

const validateSku = (sku, fieldStatus) => {
  const target = convertSku(sku)
  let error = []
  Object.entries(map).forEach(([targetKey, { key: sourceKey }]) => {
    const { visible, required } = fieldStatus[sourceKey] || {}
    if (!visible) {
      return
    }
    const result = validator(`sku.${targetKey}`, target[targetKey], {
      sku: target,
      nodeConfig: { required }
    })
    if (result) {
      error.push(result)
    }
  })
  return error
}

const validateCollection = {
  [SPU_FIELD.NAME]: (value, { required }) => validator('title', value, { nodeConfig: { required } }),
  [SPU_FIELD.CATEGORY]: (value, { required }) => validator('categoryName', value.name, { nodeConfig: { required } }),
  [SPU_FIELD.TAG_LIST]: (value, { required, label }) => {
    if (!required) {
      return
    }
    const empty = !value || value.length <= 0
    if (empty) {
      return `${label}不能为空`
    }
  },
  [SPU_FIELD.PICTURE_LIST]: (value, { required }) => validator('picture', value, { nodeConfig: { required, noGap: true } }),
  [SPU_FIELD.PRODUCT_VIDEO]: (value) => {
    if (value && value.id && value.status !== VIDEO_STATUS.SUCCESS) {
      return '商品视频状态异常'
    }
  },
  [SPU_FIELD.SKU_LIST]: (value, { fieldStatus }) => {
    const soldSkuList = value.filter(sku => sku.editable)
    if (soldSkuList.length <= 0) {
      return '售卖信息列表必须有一条售卖中的信息'
    }
    let error = ''
    soldSkuList.some(sku => {
      const errorList = validateSku(sku, fieldStatus)
      error = errorList.pop()
      return !!error
    })
    return error
  },
  [SPU_FIELD.LIMIT_SALE]: (value, { minCount }) => {
    const { status = 0, range = [], rule, max = 0 } = value
    if (!status) return '' // 不限制的话不进行校验
    if (!range.length || range.some(v => !v)) return '限购周期不能为空'
    if (!rule) return '请选择限购规则'
    if (max < 1) return '限购数量必须>=1'
    // 最大购买量不能小于sku中最小购买量的最大值
    if (max < minCount) return '限购数量必须>=最小购买量'
  },
  [SPU_FIELD.PICTURE_CONTENT]: (value, { max }) => {
    if (value.length > max) {
      return '图片详情最多只能上传20张图片'
    }
  },
  [SPU_FIELD.DESCRIPTION]: (value, { maxLength }) => {
    maxLength = maxLength || Infinity
    if (value && value.length > maxLength) {
      return `文字详情最多输入${maxLength}字`
    }
  }
}

export default (key) => (value, options) => {
  const validator = validateCollection[key] || noop
  return validator(value, options)
}
