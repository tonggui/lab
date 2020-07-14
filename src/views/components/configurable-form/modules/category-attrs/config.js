import createAttrConfig from './attrConfig'
import { mergeConfig } from '../../form/utils'

export default (attrs, { disabled } = {}) => {
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
            // TODO
            const attrStatus = this.getContext(`${attr.id}`) || {}
            return attrStatus.layout
          },
          disabled () {
            // TODO
            const attrStatus = this.getContext(`${attr.id}`) || {}
            // TODO 字段锁定逻辑
            const propertyLock = this.getContext('propertyLock')
            const isSp = this.getContext('isSp')
            return disabled || (attr.required && isSp && propertyLock) || attrStatus.disabled
          }
        }
      }
    }
    const detail = createAttrConfig(attr)
    return mergeConfig(base, detail)
  })
}
