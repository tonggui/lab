import Form from '../../form'
import CategoryAttrModule from '../../modules/category-attrs'
import { SPU_FELID } from '../../felid'
import { getProduct, getContext } from './initData'
import getConfig from '../../base-config/process-config'

export default (components = {}, service = {}) => {
  const form = new Form(components, service)

  const config = getConfig(form.components)
  form.init({ data: getProduct(), context: getContext(), config })
  form.register(SPU_FELID.CATEGORY_ATTRS, CategoryAttrModule)

  return form
}
