// TODO 校验
/* eslint-disable */
import { validate } from '@sgfe/product-validate'
import { SPU_FELID, SKU_FELID } from './felid'
import { VIDEO_STATUS } from '@/data/constants/video'

const validator = (...args) => {
  const result = validate(...args)
  if (result.code === 1) {
    throw Error(result.msg)
  }
}

// TODO sku校验问题
// const map = {
//   name: 'specName',
//   price: 'price.value',
//   weight: 'weight.value',
//   weightUnit: 'weight.unit',
//   stock: 'stock',
//   ladderPrice: 'box.price',
//   ladderNum: 'box.count',
//   code: 'sourceFoodCode',
//   shelfCode: 'shelfNum'
// }

const validateSku = (sku, { required, disabled, visible }) => {
}

module.exports = [{
  key: SPU_FELID.NAME,
  validate ({ value, required }) {
    return validator('title', value, { required })
  }
}, {
  key: SPU_FELID.CATEGORY,
  validate ({ value, required }) {
    return validator('categoryName', value.name, { required })
  }
}, {
  key: SPU_FELID.TAG_LIST,
  validate ({ value, required, label }) {
    if (!required) {
      return
    }
    const empty = !value || value.length <= 0
    if (empty) {
      throw Error(`${label}不能为空`)
    }
  }
}, {
  key: SPU_FELID.PICTURE_LIST,
  validate ({ value, required }) {
    return validator('picture', value, { required, noGap: true })
  }
}, {
  key: SPU_FELID.PRODUCT_VIDEO,
  validate ({ value }) {
    if (value && value.id && value.status !== VIDEO_STATUS.SUCCESS) {
      throw Error('商品视频状态异常')
    }
  }
}, {
  key: SPU_FELID.SKU_LIST,
  validate ({ value }) {
    const felidContext = this.getContext('skuFelid') || {}
    // 重量过重的校验
    const weightStatus = felidContext[SKU_FELID.WEIGHT] || {}
    if (weightStatus.visible) {
      const overflow = value.some(({ weight }) => {
        return !weight.ignoreMax && weightOverflow(weight)
      })
      if (overflow) {
        return '重量过大，请核实后再保存商品'
      }
    }
    return value.forEach(sku => validateSku(value, felidContext))
  }
}, {
  key: SPU_FELID.LIMIT_SALE,
  validate ({ value }) {
    // TODO
    const { status = 0, range = [], rule, max = 0 } = value
    if (!status) return '' // 不限制的话不进行校验
    if (!range.length || range.some(v => !v)) return '限购周期不能为空'
    if (!rule) return '请选择限购规则'
    // 最大购买量不能小于sku中最小购买量的最大值
    const skuList = this.getData('skuList') || []
    let minCount = 1
    skuList.forEach(sku => {
      minCount = Math.max(minCount, sku.minOrderCount || 0)
    })
    if (max < minCount) return '限购数量必须>=最小购买量'
  }
}, {
  key: SPU_FELID.PICTURE_CONTENT,
  validate ({ value = [], options }) {
    const { max } = options
    if (value.length > max) {
      return '图片详情最多只能上传20张图片'
    }
  }
}]
