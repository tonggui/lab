import {
  fetchGetCombineMedicineCategoryAttrList
} from '@/data/repos/category'

export default {
  getContext: () => ({}),
  async getCategoryAttrs (categoryId) {
    const categoryAttrList = await fetchGetCombineMedicineCategoryAttrList(categoryId)
    // 医药标品提报-过滤销售属性（销售属性只应用在商品，不在标品库中维护，因此在标品提报时上传销售属性无意义）
    return categoryAttrList.filter((attr) => attr.attrType !== 2)
  }
}
