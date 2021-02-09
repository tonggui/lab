import router from '@/router'
import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import ExcelCreate from '@/views/batch-management/batch-create/components/excel-create/excel-create'
import { Message } from '@roo-design/roo-vue'
import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
import {
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
} from '@/data/repos/merchantPoi'
import { isMedicine } from '@/common/app'

export default withBatchSelectPoi({
  allowClear: true,
  supportSelectAll: !(isMedicine() || router.currentRoute.name === 'merchantMedicineBatchCreate'),
  onEmpty: () => Message.error('请先选择目标门店'),
  PoiSelectDrawer,
  fetchGetPoiList,
  fetchGetPoiInfoListByIdList
})(ExcelCreate)
