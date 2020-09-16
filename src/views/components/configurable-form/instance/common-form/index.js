import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData' // 表单默认 value和context
import baseService from './service' // 接口： 获取context + 获取类目属性
import validate from './validate' // 检验的config

const baseForm = createBaseForm(baseService)
/**
 * 除了 药品标品 审核页面之外，所有页面的通用表单
 */
export default ({
  components = {},
  plugins = []
} = {}) => {
  const data = getProduct()
  const context = getContext()
  return baseForm({
    data,
    context,
    initialData: getProduct() // 默认表单值，用于reset
  }, {
    components,
    plugins,
    validate
  })
}
