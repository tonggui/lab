import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
// import CategoryAttrModule from '../../modules/category-attrs'
// import { SPU_FELID } from '../../felid'
import validate from './validate'

const baseForm = createBaseForm()

export default ({ service, components }) => {
  const data = getProduct()
  const context = getContext()
  return baseForm({
    data,
    context
  }, {
    service,
    components,
    plugins: [],
    // modules: {
    //   [SPU_FELID.CATEGORY_ATTRS]: CategoryAttrModule
    // },
    validate
  })
}
