import Form from '../../form'
import getConfig from '../../base-config/process-config'

// 实例化 form 的 一个包装函数
export default ({ data = {}, context = {}, initialData = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  // 创建form 传递 组件
  const form = new Form({ components })

  // 插件 装载
  plugins = plugins || []
  plugins.forEach(p => {
    form.extends(p)
  })

  // 获取固定的一套config
  const config = getConfig(form.layouts, form.components, form.containers)
  // 校验信息 填充
  form.validator(validate)

  // 初始化啦～。～
  form.init({ config, data, context, initialData })

  return form
}
