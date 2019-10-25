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
      return v + context.weightUnit || ''
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
  }
}
