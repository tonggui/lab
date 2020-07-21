import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
import baseService from './service'
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
    validate
  })
}
