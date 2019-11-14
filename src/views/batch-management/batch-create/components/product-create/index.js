import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
import ProductCreate from './product-create'
import { Message } from '@roo-design/roo-vue'
import { fetchGetCategoryAttrSwitch } from '@/data/repos/category'

export default withBatchSelectPoi({
  allowClear: true,
  onEmpty: () => Message.error('请先选择目标门店'),
  onChange: async (poiIdList) => {
    let categoryAttrSwitch = false
    if (poiIdList && poiIdList.length > 0) {
      categoryAttrSwitch = await fetchGetCategoryAttrSwitch(poiIdList)
    }
    // TODO
    console.log('重新获取类目属性开关的接口', poiIdList, categoryAttrSwitch)
  }
})(ProductCreate)
