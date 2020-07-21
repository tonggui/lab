import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
import baseService from './service'
// import CategoryAttrModule from '../../modules/category-attrs'
// import { SPU_FELID } from '../../felid'
import validate from './validate'

const baseForm = createBaseForm(baseService)

export default ({
  components = {},
  plugins = []
} = {}) => {
  const data = getProduct()
  const context = getContext()
  return baseForm({
    data,
    context
  }, {
    components,
    plugins,
    // modules: {
    //   [SPU_FELID.CATEGORY_ATTRS]: CategoryAttrModule
    // },
    validate
  })
}
