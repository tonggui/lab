import createAttrConfig from './attr-config'
import { mergeConfig } from '@/views/components/configurable-form/form/utils'

// 参考 src/views/components/product-form/components/category-attrs/config.js
export default (attrs, { components }) => {
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
          'options.attribute' () {
            const attrContext = this.getContext('attr')[`${attr.id}`] || {}
            return (attrContext.options || {})
          },
          container () {
            const attrContext = this.getContext('attr')[`${attr.id}`] || {}
            return (attrContext.container || []).concat([])
          },
          disabled () {
            const disabled = this.getContext('disabled')
            const attrContext = this.getContext('attr')[`${attr.id}`] || {}
            return disabled || !!attrContext.disabled
          }
        }
      }
    }
    const detail = createAttrConfig(attr, components)
    return mergeConfig(base, detail)
  })
}
