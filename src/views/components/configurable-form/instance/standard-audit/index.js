import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData'
import validate from './validate'
import service from './service'

const baseForm = createBaseForm(service)

// 药品标品审核 专属 form
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
