import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import { Message } from '@roo-design/roo-vue'
import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
import {
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
} from '@/data/repos/merchantPoi'
import ProductRel from './product-rel'
import { isMedicine } from '@/common/app'

export default withBatchSelectPoi({
  allowClear: true,
  supportSelectAll: !isMedicine(),
  label: '关联门店',
  onEmpty: () => Message.error('请先选择关联门店'),
  prepend: false,
  PoiSelectDrawer,
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
})(ProductRel)
