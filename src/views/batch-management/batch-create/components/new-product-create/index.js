import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import ProductCreate from './product-create'
import { Message } from '@roo-design/roo-vue'

export default withBatchSelectPoi({
  allowClear: true,
  onEmpty: () => {
    Message.error('请先选择目标门店')
  }
})(ProductCreate)
