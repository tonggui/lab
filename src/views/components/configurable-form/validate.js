// 校验逻辑 主要格式校验 通过 @sgfe/product-validate
import { validate } from '@sgfe/product-validate'
import { SPU_FIELD } from './field'
import { VIDEO_STATUS } from '@/data/constants/video'
import { noop, get } from 'lodash'
import { PRODUCT_SALE_TYPE } from '@/data/enums/product'

const validator = (...args) => {
  const result = validate(...args)
  if (result.code === 1) {
    return result.msg
  }
}
// sku字段转换
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

// @sgfe/product-validate 和 当前商品格式字段不一致，需要转换
const validateCollection = {
  [SPU_FIELD.NAME]: (value, { required, label, options }) => {
    if (!required) return ''
    if (!value) return `${label}不能为空`
    const { max = 45 } = options.attribute || { max: 45 } // 默认最大长度
    if (value.length > max) return `${label}最大仅支持${max}字的长度`
  },
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
  // 限购校验，需要校验 限购数量 是否大于最小购买量
  // TODO sku的最小购买量字段是可配置的，这边判断的时候是通过 最小购买量的默认值 1来判断的
  // TODO 对于限购 < 1的 提前判断了一下，避免了👆的问题
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
      return `图片详情最多只能上传${max}张图片`
    }
  },
  [SPU_FIELD.DESCRIPTION]: (value, { maxLength }) => {
    maxLength = maxLength || Infinity
    if (value && value.length > maxLength) {
      return `文字详情最多输入${maxLength}字`
    }
  },
  [SPU_FIELD.SALE_TYPE]: (value) => {
    if (value.saleType === PRODUCT_SALE_TYPE.PRE && !value.deliveryTime) {
      return '发货时间不能为空'
    }
  }
}

export default (key) => (value, options) => {
  const validator = validateCollection[key] || noop
  return validator(value, options)
}
