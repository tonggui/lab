import createForm from '@/views/components/configurable-form/instance/common-form'

import { buildCategoryAttrsContainer } from '@/views/components/configurable-form/components/category-attrs'
import CategoryPath from '@/views/merchant/components/category-path'
import { buildCascaderWithApi } from '@/views/components/product-form/components/category-attrs/components/cascader'
import { fetchGetCategoryAttrListByParentId } from '@/data/repos/merchantCategory'

const createMerchantForm = ({
  components = {},
  plugins = []
}) => createForm({
  components: {
    CategoryPath,
    CategoryAttrs: buildCategoryAttrsContainer({
      components: {
        CategoryAttrCascader: buildCascaderWithApi({
          fetchCategoryAttrListByParentId: fetchGetCategoryAttrListByParentId
        })
      }
    }),
    ...components
  },
  plugins
})

export default createMerchantForm
