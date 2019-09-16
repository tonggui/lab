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

export default {
  TITLE: {
    label: '商品标题',
    diffComponent: DefaultItem
  },
  WEIGHT: {
    label: '商品重量',
    diffComponent: DefaultItem,
    convertor (v, context = {}) {
      return v + context.weightUnit || ''
    }
  },
  PICTURE: {
    label: '商品图片',
    diffComponent: PictureItem
  },
  SPEC: {
    label: '规格',
    diffComponent: DefaultItem
  }
}
