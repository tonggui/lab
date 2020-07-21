import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
import validate from './validate'

const baseForm = createBaseForm()

export default ({ components } = {}) => {
  const data = getProduct()
  const context = getContext()
  return baseForm({
    data,
    context
  }, {
    components,
    plugins: [],
    validate
  })
}
