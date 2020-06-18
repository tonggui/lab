/*
 * @description
 *   Please write the map script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-17)
 */
import DefaultItem from './diff-item/item-default.vue'
import PictureItem from './diff-item/item-picture.vue'
import TextRecovery from './error-recovery-components/text-recovery'
import PictureRecovery from './error-recovery-components/picture-recovery'
import WeightRecovery from './error-recovery-components/weight-recovery'
import CategoryAttrSelector from '../product-form/components/category-attrs/components/selector'
import CategoryAttrText from '../product-form/components/category-attrs/components/text'

import { RENDER_TYPE, VALUE_TYPE } from '@/data/enums/category'

export default {
  TITLE: {
    label: '商品标题',
    diffComponent: DefaultItem,
    errorRecoveryComponent: TextRecovery
  },
  WEIGHT: {
    label: '商品重量',
    diffComponent: DefaultItem,
    errorRecoveryComponent: WeightRecovery,
    display (v, context = {}) {
      return (v || '--') + context.weightUnit || ''
    },
    convert (v) {
      return +v + ''
    },
    validate (v) {
      const reg = /^\d*(.\d{0,2})?$/
      if (!reg.test(v)) {
        return '商品重量必须为不超过两位小数的数字'
      }
    }
  },
  PICTURE: {
    label: '商品图片',
    diffComponent: PictureItem,
    errorRecoveryComponent: PictureRecovery
  },
  SPEC: {
    label: '规格',
    diffComponent: DefaultItem,
    errorRecoveryComponent: TextRecovery
  },
  MEDICINE_UPC: {
    label: 'UPC码',
    diffComponent: DefaultItem
  },
  MEDICINE_NAME: {
    label: '药品名称',
    diffComponent: DefaultItem
  },
  MEDICINE_SPEC: {
    label: '规格',
    diffComponent: DefaultItem
  },
  MEDICINE_SUGGESTED_PRICE: {
    label: '指导价',
    diffComponent: DefaultItem
  },
  MEDICINE_PICTURE: {
    label: '图片',
    diffComponent: PictureItem
  }
}

export const categoryAttrMap = {
  [RENDER_TYPE.SELECT]: {
    diffComponent: CategoryAttrSelector,
    propsConvert (attr) {
      return {
        width: '100%',
        multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT,
        valueKey: 'id',
        labelKey: 'name',
        source: attr.options
      }
    }
  },
  [RENDER_TYPE.INPUT]: {
    diffComponent: CategoryAttrText,
    propsConvert (attr) {
      const length = Math.max(attr.newValue ? attr.newValue.length : 0, attr.oldValue ? attr.oldValue.length : 0)
      const rows = Math.min(3, Math.ceil(length / 20))
      return {
        type: rows >= 2 ? 'textarea' : 'text',
        rows
      }
    }
  }
}
