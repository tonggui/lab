import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
import validate from './validate'
import service from './service'

const baseForm = createBaseForm(service)

export default ({ components } = {}) => {
  const data = getProduct()
  const context = getContext()
  return baseForm({
    data,
    context,
    initialData: getProduct()
  }, {
    components,
    plugins: [],
    validate
  })
}
