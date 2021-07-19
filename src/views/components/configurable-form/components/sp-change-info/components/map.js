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
import CategoryRecovery from './error-recovery-components/category-recovery'
import CategoryAttrSelector from '@/views/components/product-form/components/category-attrs/components/selector'
import CategoryAttrText from '@/views/components/product-form/components/category-attrs/components/text'
import CategoryAttrBrand from '@/views/components/product-form/components/category-attrs/components/brand'
import CategoryAttrCascader from '@/views/components/product-form/components/category-attrs/components/cascader'

import { RENDER_TYPE, VALUE_TYPE } from '@/data/enums/category'
import { SP_CHANGE_FIELD } from '@/data/enums/fields'

export default {
  [SP_CHANGE_FIELD.NAME]: {
    label: '商品标题',
    diffComponent: DefaultItem,
    errorRecoveryComponent: TextRecovery
  },
  [SP_CHANGE_FIELD.CATEGORY]: {
    label: '商品类目',
    diffComponent: DefaultItem,
    display (v, context = {}) {
      return ((v || {}).namePath || []).join('>')
    },
    errorRecoveryComponent: CategoryRecovery
  },
  [SP_CHANGE_FIELD.WEIGHT]: {
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
  [SP_CHANGE_FIELD.PICTURE_LIST]: {
    label: '商品图片',
    diffComponent: PictureItem,
    errorRecoveryComponent: PictureRecovery
  },
  [SP_CHANGE_FIELD.SPEC_NAME]: {
    label: '规格',
    diffComponent: DefaultItem,
    errorRecoveryComponent: TextRecovery
  },
  [SP_CHANGE_FIELD.SUGGESTED_PRICE]: {
    label: '指导价',
    diffComponent: DefaultItem
  },
  [SP_CHANGE_FIELD.UPC_CODE]: {
    label: 'UPC码',
    diffComponent: DefaultItem
  }
}

export const categoryAttrMap = {
  [RENDER_TYPE.BRAND]: {
    diffComponent: CategoryAttrBrand,
    propsConvert (attr) {
      return {
        width: '100%',
        placeholder: '',
        maxCount: 1,
        showSearch: true,
        source: attr.options,
        attr,
        multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
      }
    }
  },
  [RENDER_TYPE.CASCADE]: {
    diffComponent: CategoryAttrCascader,
    propsConvert (attr) {
      return {
        width: '100%',
        maxCount: attr.maxCount || 1,
        showSearch: !!attr.search,
        cascader: !!attr.cascade,
        source: attr.options,
        attr,
        multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
      }
    }
  },
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
