import CategoryPath from '@/views/medicine/merchant/components/category-path'
import { buildCategoryAttrComponent } from './categoryAttrs'
import ChooseProduct from './choose-product'

export default {
  CategoryPath,
  ChooseProduct: ChooseProduct,
  CategoryAttrs: buildCategoryAttrComponent()
}
