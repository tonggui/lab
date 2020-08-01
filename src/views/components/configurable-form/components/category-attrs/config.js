import createAttrConfig from './attr-config'
import { mergeConfig } from '@/views/components/configurable-form/form/utils'
import Layout from './layout'
import { SPU_FIELD } from '@/views/components/configurable-form/field'

export default (attrs) => {
  return attrs.map(attr => {
    const base = {
      key: `${attr.id}`,
      label: attr.name,
      required: attr.required,
      emptyTip: false,
      value: undefined,
      options: {
        width: '300px'
      },
      rules: {
        result: {
          layout () {
            const attrContext = this.getContext('attr')[`${attr.id}`] || {}
            return Layout(attrContext.layout || [])
          },
          disabled () {
            const excludes = this.getContext('excludeDisableFields')
            if (excludes.includes[SPU_FIELD.ATTRIBUTE_LIST]) return false

            const disabled = this.getContext('disabled')
            const attrContext = this.getContext('attr')[`${attr.id}`] || {}
            return disabled || !!attrContext.disabled
          }
        }
      }
    }
    const detail = createAttrConfig(attr)
    return mergeConfig(base, detail)
  })
}
