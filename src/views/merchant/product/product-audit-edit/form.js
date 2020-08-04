// TODO 运营端表单配置?
import createForm from '@/views/components/configurable-form/instance/common-form'
import createSuggestTagListPlugin from '@/views/components/configurable-form/plugins/tag-list'
// import createCategorySelectSpPlugin from '@/views/components/configurable-form/plugins/category-select-sp'
// import createPropertyLockPlugin from '@/views/components/configurable-form/plugins/property-lock'
// import SelectProductFromLibrary from '@/views/components/configurable-form/plugins/product-library'
import {
  fetchGetTagList
} from '@/data/repos/merchantCategory'

const plugins = [
  createSuggestTagListPlugin({
    getTagList: fetchGetTagList
  })
  // SelectProductFromLibrary()
  // createPropertyLockPlugin()
]

export default createForm({ plugins })
