import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import ProductDelete from './product-delete'
import { Message } from '@roo-design/roo-vue'

export default withBatchSelectPoi({
  allowClear: true,
  onEmpty: () => Message.error('请先选择目标门店')
})(ProductDelete)
