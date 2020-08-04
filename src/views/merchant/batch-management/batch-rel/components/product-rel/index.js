import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import { Message } from '@roo-design/roo-vue'
import ProductRel from './product-rel'

export default withBatchSelectPoi({
  allowClear: true,
  label: '关联门店',
  onEmpty: () => Message.error('请先选择关联门店'),
  prepend: false
})(ProductRel)
