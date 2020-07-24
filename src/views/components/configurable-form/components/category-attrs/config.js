import createAttrConfig from './attr-config'
import { mergeConfig } from '@/views/components/configurable-form/form/utils'
import Layout from './layout'

export default (attrs) => {
  const width = attrs.length >= 4 ? '300px' : '440px'
  return attrs.map(attr => {
    const base = {
      key: `${attr.id}`,
      label: attr.name,
      required: attr.required,
      emptyTip: false,
      value: undefined,
      options: {
        width
      },
      rules: {
        result: {
          layout () {
            const attrContext = this.getContext(`${attr.id}`) || {}
            return Layout(attrContext.layout || [])
          },
          disabled () {
            const disabled = this.getContext('disabled')
            const attrContext = this.getContext(`${attr.id}`) || {}
            return disabled || !!attrContext.disabled
          }
        }
      }
    }
    const detail = createAttrConfig(attr)
    return mergeConfig(base, detail)
  })
}
