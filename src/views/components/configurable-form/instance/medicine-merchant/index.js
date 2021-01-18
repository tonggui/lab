import createBaseForm from '../base-form'
import { getProduct, getContext } from './initData' // 表单默认 value和context
import baseService from './service' // 接口： 获取context + 获取类目属性
import validate from './validate' // 检验的config

const baseForm = createBaseForm(baseService)
/**
 *  复制 common-form(方便以后差异化修改), 修改了 service -> getContext
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
