import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import { Message } from '@roo-design/roo-vue'
import PoiSelectDrawer from '@/views/medicine/merchant/components/poi-select-drawer'
import {
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
} from '@/data/repos/merchantPoi'
import ProductRel from './product-rel'

export default withBatchSelectPoi({
  allowClear: true,
  supportSelectAll: false,
  label: '关联门店',
  onEmpty: () => Message.error('请先选择关联门店'),
  prepend: false,
  PoiSelectDrawer,
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
})(ProductRel)
