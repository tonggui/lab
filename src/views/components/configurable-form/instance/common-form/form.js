import Form from '../../form'
import SuggestCategoryPlugin from '../../plugins/suggest-category'
import SuggestTagListPlugin from '../../plugins/suggest-tag-list'
import TagListPlugin from '../../plugins/tag-list'
import CategorySelectSpPlugin from '../../plugins/category-select-sp'
import CategoryAttrModule from '../../modules/category-attrs'
import { SPU_FELID } from '../../felid'
import { getProduct, getContext } from './initData'
import getConfig from '../../base-config/process-config'

export default (components = {}, service = {}) => {
  const form = new Form(components, service)

  form.extends(TagListPlugin)
  form.extends(SuggestTagListPlugin)
  form.extends(CategorySelectSpPlugin)
  form.extends(SuggestCategoryPlugin)
  const config = getConfig(form.components)
  form.init({ data: getProduct(), context: getContext(), config })
  form.register(SPU_FELID.CATEGORY_ATTRS, CategoryAttrModule)

  return form
}
