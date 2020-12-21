import { buildCategoryAttrsContainer } from '@/views/components/configurable-form/components/category-attrs'
import { buildCascaderWithApi } from '@/views/components/product-form/components/category-attrs/components/cascader'
import { fetchGetCategoryAttrListByParentId } from '@/data/repos/medicineMerchantCategory'

export const buildCategoryAttrComponent = (options = {}) => buildCategoryAttrsContainer({
  components: {
    CategoryAttrCascader: buildCascaderWithApi({
      fetchCategoryAttrListByParentId: fetchGetCategoryAttrListByParentId
    })
  },
  ...options
})
