import { validate } from '@sgfe/product-validate'
import { SPU_FELID } from './felid'
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
    key: 'spec',
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

const validateSku = (sku, felidStatus) => {
  const target = convertSku(sku)
  Object.entries(map).forEach(([targetKey, { key: sourceKey }]) => {
    const { visible, required } = felidStatus[sourceKey]
    if (!visible) {
      return
    }
    const result = validator(`sku.${targetKey}`, target[targetKey], {
      sku: target,
      nodeConfig: { required }
    })
    return result
  })
}

const validateCollection = {
  [SPU_FELID.NAME]: (value, { required }) => validator('title', value, { required }),
  [SPU_FELID.CATEGORY]: (value, { required }) => validator('categoryName', value.name, { required }),
  [SPU_FELID.TAG_LIST]: (value, { required, label }) => {
    if (!required) {
      return
    }
    const empty = !value || value.length <= 0
    if (empty) {
      return `${label}不能为空`
    }
  },
  [SPU_FELID.PICTURE_LIST]: (value, { required }) => validator('picture', value, { required, noGap: true }),
  [SPU_FELID.PRODUCT_VIDEO]: (value) => {
    if (value && value.id && value.status !== VIDEO_STATUS.SUCCESS) {
      return '商品视频状态异常'
    }
  },
  [SPU_FELID.SKU_LIST]: (value, { felidStatus }) => {
    return value.forEach(sku => validateSku(sku, felidStatus))
  },
  [SPU_FELID.LIMIT_SALE]: (value, { minCount }) => {
    const { status = 0, range = [], rule, max = 0 } = value
    if (!status) return '' // 不限制的话不进行校验
    if (!range.length || range.some(v => !v)) return '限购周期不能为空'
    if (!rule) return '请选择限购规则'
    // 最大购买量不能小于sku中最小购买量的最大值
    if (max < minCount) return '限购数量必须>=最小购买量'
  },
  [SPU_FELID.PICTURE_CONTENT]: (value, { max }) => {
    if (value.length > max) {
      return '图片详情最多只能上传20张图片'
    }
  }
}

export default (key) => (value, options) => {
  const validator = validateCollection[key] || noop
  return validator(value, options)
}
