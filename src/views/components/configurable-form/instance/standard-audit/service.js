import {
  fetchGetCombineMedicineCategoryAttrList
} from '@/data/repos/category'
import {
  fetchGetSpConfig
} from '@/data/repos/medicine'

export default {
  // 普通标品审核config
  getContext: () => ({}),
  // 医药纠错标品审核config
  getSpContext: () => fetchGetSpConfig(),
  async getCategoryAttrs (categoryId) {
    const categoryAttrList = await fetchGetCombineMedicineCategoryAttrList(categoryId)
    // 医药标品提报-过滤销售属性（销售属性只应用在商品，不在标品库中维护，因此在标品提报时上传销售属性无意义）
    return categoryAttrList.filter((attr) => attr.attrType !== 2)
  }
}
