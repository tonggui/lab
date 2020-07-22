import Form from '../../form'
import getConfig from '../../base-config/process-config'

export default ({ data = {}, context = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  const form = new Form(components)

  plugins = plugins || []

  plugins.forEach(p => {
    form.extends(p)
  })

  const config = getConfig(form.components)
  form.validator(validate)

  form.init({ config, data, context })

  return form
}
