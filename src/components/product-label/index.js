/*
 * @description
 *   Please write the index script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-10)
 */
import withAsyncTask from '@/hoc/withAsyncTask'
import { fetchGetProductLabelList } from '@/data/repos/product'
import ProductLabel from './product-label'

const DEFAULT_LABELS = [
  {
    label: '力荐',
    value: 1
  }
]

export default withAsyncTask(fetchGetProductLabelList, {
  initData: DEFAULT_LABELS,
  key: 'items',
  mounted: false
})(ProductLabel)
