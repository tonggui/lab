/*
 * @description
 *   Please write the map script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-17)
 */
import DefaultItem from './item-default'
import PictureItem from './item-picture'

export default {
  name: {
    label: '商品标题',
    component: DefaultItem
  },
  weight: {
    label: '商品重量',
    component: DefaultItem,
    convertor (v, context = {}) {
      return v + context.weightUnit || ''
    }
  },
  pic: {
    label: '商品图片',
    component: PictureItem,
    convertor (v = []) {
      if (Array.isArray(v)) {
        return v
      } else {
        return `${v || ''}`.split(',')
      }
    }
  },
  spec: {
    label: '规格',
    component: DefaultItem
  }
}
