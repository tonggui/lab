import Form from '../../form'
import getConfig from '../../base-config/process-config'

export default ({ data = {}, context = {}, initialData = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  const form = new Form(components)

  plugins = plugins || []

  plugins.forEach(p => {
    form.extends(p)
  })

  const config = getConfig(form.layouts, form.components, form.containers)
  form.validator(validate)

  form.init({ config, data, context, initialData })

  return form
}
