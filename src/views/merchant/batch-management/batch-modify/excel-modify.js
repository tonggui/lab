import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import ExcelModify from '@/views/batch-management/batch-modify/components/excel-modify/excel-modify'
import { Message } from '@roo-design/roo-vue'
import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
import {
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
} from '@/data/repos/merchantPoi'

export default withBatchSelectPoi({
  allowClear: true,
  onEmpty: () => Message.error('请先选择目标门店'),
  PoiSelectDrawer,
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
})(ExcelModify)
